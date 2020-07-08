import { Request } from 'express';
import * as mongoose from 'mongoose';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { BoatsService } from '../boats/boats.service';
import { CrudController } from '../crud/crud.controller';
import { IQuery } from '../crud/crud.service';
import { EmailService } from '../email/email.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { HistoryService } from '../history/history.service';
import { ProfileService } from '../profile-service/profile.service';
import { RequiredActionsService } from '../required-actions/required-actions.service';
import { SailChecklistsService } from '../sail-checklists/sail-checklists.service';
import { BOAT_STATUS } from '../shared/boat/boat-status';
import { IBoat } from '../shared/boat/boat.interface';
import { IComment } from '../shared/comment/comment.interface';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { PROFILE_STATUS } from '../shared/profile/profile-status.enum';
import {
  IProfile,
  PROFILE_PROPS,
} from '../shared/profile/profile.interface';
import { IRequiredAction } from '../shared/required-action/required-action.interface';
import { REQUIRED_ACTION_STATE } from '../shared/required-action/required-action.state';
import { REQUIRED_ACTIONS } from '../shared/required-action/required-action.types';
import { SAIL_STATUS } from '../shared/sail/sail-status';
import {
  ISail,
  ISailResolved,
  SAIL_PROPS,
} from '../shared/sail/sail.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { SailsService } from './sails.service';

export const POPULATE_ALL_PEOPLE: SAIL_PROPS[] = [
  SAIL_PROPS.SKIPPER,
  SAIL_PROPS.CREW,
  SAIL_PROPS.PASSENGERS,
  SAIL_PROPS.CANCELLED_BY,
];

export const POPULATE_ALL: SAIL_PROPS[] = [
  ...POPULATE_ALL_PEOPLE,
  SAIL_PROPS.BOAT,
  SAIL_PROPS.COMMENTS,
];

@Controller('sails')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailsController extends CrudController<ISail> {

  constructor(
    private boatsService: BoatsService,
    private emailService: EmailService,
    private historyService: HistoryService,
    private profileService: ProfileService,
    private requiredActionsService: RequiredActionsService,
    private sailChecklistService: SailChecklistsService,
    service: SailsService,
  ) {
    super(service);
  }

  @Post()
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.COORDINATOR, PROFILE_ROLES.SKIPPER])
  create(
    @Req() req: Request,
    @Body() document: ISail,
    @Query() query: IQuery,
  ): Promise<ISail> {
    const user: JwtObject = req.user;

    return super
      .create(req, document, query)
      .then((createdSail) => {
        this.service
          .findById<ISailResolved>(createdSail.id, { populate: POPULATE_ALL })
          .then(resolvedSail => this.emailService.emailUtils.sendNewSailEmail(resolvedSail, user.username))
          .catch(error => this.logError(error));
        return createdSail;
      });
  }

  @Patch(':id')
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.COORDINATOR, PROFILE_ROLES.SKIPPER])
  update(@Req() req, @Param('id') id: string, @Body() document: ISail, @Query() query?: IQuery): Promise<ISail> {
    const user: JwtObject = req.user;

    return super
      .update(req, id, document, query)
      .then((updatedSail) => {
        this.service
          .findById<ISailResolved>(id, { populate: POPULATE_ALL })
          .then(resolvedSail => this.emailService.emailUtils.sendSailUpdateEmail(resolvedSail, user.username))
          .catch(error => this.logError(error));
        return updatedSail;
      });
  }

  @Get()
  find<R>(@Query() query): Promise<R[]> {
    return super.find(query);
  }

  @Post('/start/:id')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER, PROFILE_ROLES.CREW])
  startSail(
    @Req() req: Request,
    @Param('id') id): Promise<ISail> {
    const user: JwtObject = req.user;

    return this.service
      .findById<ISail>(id)
      .then(sail => this.sailChecklistService
        .create({ boat: sail.boat, sail: sail.id, sailEnd: sail.end, sailStart: sail.start }),
      )
      .then((checklist) => {
        this.historyService.create({
          byId: user.profileId,
          byName: user.username,
          event: 'started sail',
          forId: id,
          forName: 'sail',
        }).catch(error => this.logError(error));
        return this.service
          .updateById(id, { status: SAIL_STATUS.STARTED, checklist: checklist.id });
      });
  }

  @Post('/complete/:id')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER, PROFILE_ROLES.CREW])
  completeSail(@Req() req, @Param('id') id): Promise<ISail> {
    const user: JwtObject = req.user;

    return this.service
      .updateById(id, { status: SAIL_STATUS.COMPLETED })
      .then((completedSail) => {
        const dueDate = new Date();

        dueDate.setTime(dueDate.getTime() + (1000 * 60 * 60 * 48)); // +48 hours

        const feedbackAction: IRequiredAction = {
          dueDate,
          actionType: REQUIRED_ACTIONS.RATE_SAIL,
          assignedBy: user.userId,
          assignedOn: new Date(),
          data: { sailId: completedSail.id },
          description: `Rate your recent sail "${completedSail.name}"`,
          state: REQUIRED_ACTION_STATE.NEW,
        };

        const notifyUsers = new Set<string>();

        notifyUsers.add(completedSail.skipper);
        notifyUsers.add(completedSail.crew);

        (completedSail.passengers || [])
          .forEach(passenger => notifyUsers.add(passenger));

        notifyUsers
          .forEach((profileId) => {
            if (profileId) {
              feedbackAction.assignedTo = profileId;
              this.requiredActionsService.create(feedbackAction).catch(error => this.logError(error));
            }
          });

        return completedSail;
      });
  }

  @Post('/cancel/:id')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER, PROFILE_ROLES.ADMIN, PROFILE_ROLES.COORDINATOR])
  cancelSail(@Param('id') id, @Body() document: ISail): Promise<ISail> {

    const cancelledSail: ISail = {
      cancelReason: document.cancelReason,
      cancelledBy: document.cancelledBy,
      cancelledOn: document.cancelledOn,
    };

    return this.service
      .updateById(
        id,
        { status: SAIL_STATUS.CANCELLED, ...cancelledSail },
      )
      .then((canceledSail) => {
        this.service
          .findById(id, { populate: POPULATE_ALL_PEOPLE })
          .then(resolvedSail => this.emailService.emailUtils.sendSailCancellationEmail(resolvedSail))
          .catch(error => this.logError(error));
        return canceledSail;
      });
  }

  @Post(':sailid/join/passenger')
  @SetMetadata('roles', [PROFILE_ROLES.MEMBER])
  joinAsPassenger(@Req() req: Request, @Param('sailid') sailId: string, @Query() query): Promise<ISail> {
    const user: JwtObject = req.user;
    const userId = user.userId;

    return this.service
      .findById<ISail>(sailId)
      .then((sail) => {
        const passengers = sail.passengers || [];
        const capacity = sail.maxOccupancy - 2;

        if (passengers.length >= capacity) {
          return Promise
            .reject(new BadRequestException('Cannot join as passenger because sail is full.'));
        }

        if (passengers.includes(userId)) {
          return Promise
            .reject(new BadRequestException('User is already a passengers on this sail.'));
        }

        passengers.push(userId);

        return this.service
          .updateById(sailId, { passengers }, query)
          .then((joinedSail) => {
            this.service
              .findById<ISailResolved>(sailId, { populate: POPULATE_ALL_PEOPLE })
              .then(resolvedSail => this.emailService.emailUtils.sendJoinedSailEmail(resolvedSail, user.username, 'passenger'))
              .catch(error => this.logError(error));
            return joinedSail;
          });

      });
  }

  @Post(':sailid/join/skipper')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER])
  joinAsSkipper(@Req() req: Request, @Param('sailid') sailId: string, @Query() query): Promise<ISail> {
    const user: JwtObject = req.user;
    const userId = user.userId;

    return this.service
      .findById<ISail>(sailId)
      .then((sail) => {

        if (sail.skipper) {
          return Promise.reject(new BadRequestException('This sail already has a skipper.'));
        }

        return this.service
          .updateById(sailId, { skipper: userId }, query)
          .then((joinedSail) => {
            this.service
              .findById<ISailResolved>(sailId, { populate: POPULATE_ALL_PEOPLE })
              .then(resolvedSail => this.emailService
                .emailUtils
                .sendJoinedSailEmail(resolvedSail, user.username, 'skipper'),
              )
              .catch(error => this.logError(error));
            return joinedSail;
          });
      });
  }

  @Post(':sailid/join/crew')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER, PROFILE_ROLES.CREW])
  joinAsCrew(@Req() req: Request, @Param('sailid') sailId: string, @Query() query): Promise<ISail> {
    const user: JwtObject = req.user;
    const userId = user.userId;

    return this.service
      .findById<ISail>(sailId)
      .then((sail) => {

        if (sail.crew) {
          return Promise.reject(new BadRequestException('This sail already has a crew.'));
        }

        return this.service
          .updateById(sailId, { crew: userId }, query)
          .then((joinedSail) => {
            this.service
              .findById<ISailResolved>(sailId, { populate: POPULATE_ALL_PEOPLE })
              .then(resolvedSail => this.emailService
                .emailUtils
                .sendJoinedSailEmail(resolvedSail, user.username, 'crew'),
              )
              .catch(error => this.logError(error));
            return joinedSail;
          });

      });
  }

  @Post(':sailid/leave')
  @SetMetadata('roles', [PROFILE_ROLES.SKIPPER, PROFILE_ROLES.CREW, PROFILE_ROLES.MEMBER])
  leaveSail(@Req() req: Request, @Param('sailid') sailId: string, @Query() query): Promise<ISail> {
    const user = req.user;
    const userId = user.userId;

    return this.service
      .findById<ISail>(sailId)
      .then((sail) => {

        let updatedSail = null;

        if (sail.skipper && sail.skipper.toString() === userId) {
          updatedSail = { skipper: null };
        } else if (sail.crew && sail.crew.toString() === userId) {
          updatedSail = { crew: null };
        } else if ((sail.passengers || []).find(passenger => passenger.toString() === userId)) {
          updatedSail = {
            passengers: sail.passengers
              .filter(passenger => passenger.toString() !== userId),
          };
        }

        if (!updatedSail) {
          return Promise.reject(new BadRequestException('User is not on this sail.'));
        }

        return this.service.updateById(sailId, updatedSail, query);

      });
  }

  @Get('upcoming')
  getUpcomingSails(@Query() query): Promise<ISail[]> {
    const timeQuery = Object.assign({}, query);

    timeQuery.start = { $gte: new Date() };
    timeQuery.sort = ['start', 'end'];
    timeQuery.status = { $nin: [SAIL_STATUS.CANCELLED, SAIL_STATUS.COMPLETED] };
    timeQuery.populate = [
      'boatResolved',
      'crewResolved',
      'passengersResolved',
      'skipperResolved',
      'history',
    ]
      .concat(query.populate || []);

    const userId = timeQuery.userId;
    delete timeQuery.userId;

    if (userId) {
      timeQuery.$or = [
        { skipper: userId },
        { crew: userId },
        { passengers: userId },
      ];
    }

    return this.service.find(timeQuery);
  }

  @Get('past')
  getPastSails(@Query() query): Promise<ISail[]> {
    const timeQuery = Object.assign({}, query);

    timeQuery.start = { $lte: new Date() };
    timeQuery.sort = ['start', 'end'];
    timeQuery.populate = [
      'boatResolved',
      'crewResolved',
      'passengersResolved',
      'skipperResolved',
    ]
      .concat(query.populate || []);

    const userId = timeQuery.userId;
    delete timeQuery.userId;

    if (userId) {
      timeQuery.$or = [
        { skipper: userId },
        { crew: userId },
        { passengers: userId },
      ];
    }

    return this.service.find(timeQuery);
  }

  @Get('bydate')
  findByDate(@Query() query): Promise<ISail[]> {
    const start = query.start;
    const end = query.end;

    delete query.start;
    delete query.end;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    const dateQuery = {
      $and: [
        { start: { $gte: startISO } },
        { end: { $lte: endISO } },
      ],
    };

    query.$and = dateQuery.$and;

    return this.service.find(query);
  }

  @Get('overlapping')
  findOverlappingSail(@Query() query): Promise<ISail[]> {
    const start = query.start;
    const end = query.end;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      const dateQuery = {
        $or: [
          { start: { $lt: startISO }, end: { $gte: startISO, $lte: endISO } },
          { start: { $gte: startISO, $lte: endISO }, end: { $gte: endISO } },
          { start: { $gte: startISO }, end: { $lte: endISO } },
        ],
      };
      return this.find(dateQuery);
    }

    return Promise.resolve([]);
  }

  @Get('available-boats')
  getAvailableBoats(@Query() query): Promise<IBoat[]> {
    return this.findOverlappingSail(query)
      .then((sails) => {
        const notCancelledSails = sails.filter(sail => sail.status !== SAIL_STATUS.CANCELLED);
        const sailsWithBoats = notCancelledSails.filter(sail => sail.boat);
        const boatsOnSails = sailsWithBoats.map(sail => sail.boat);
        return this.boatsService
          .find({
            _id: { $nin: boatsOnSails },
            status: BOAT_STATUS.IN_SERVICE,
          });
      });
  }

  private getPeopleOnSails(sails): string[] {
    const sailsWithSkipper = sails.filter(sail => sail.skipper);
    const skippersOnSails = sailsWithSkipper.map(sail => sail.skipper);
    const sailsWithCrew = sails.filter(sail => sail.crew);
    const crewOnSails = sails.map(sail => sail.crew);
    const sailsWithPassengers = sails.filter(sail => sail.passengers && sail.passengers.length);
    const passengersOnSails = sailsWithPassengers.reduce(
      (red, sail) => red.concat(sail.passengers),
      [],
    );

    const peopleOnSails = []
      .concat(skippersOnSails)
      .concat(sailsWithCrew)
      .concat(crewOnSails)
      .concat(passengersOnSails);

    return peopleOnSails;
  }

  @Get('available-skippers')
  getAvailableSkippers(@Query() query): Promise<IProfile[]> {
    return this.findOverlappingSail(query)
      .then((sails) => {
        const notCancelledSails = sails.filter(sail => sail.status !== SAIL_STATUS.CANCELLED);
        const peopleOnSails = this.getPeopleOnSails(notCancelledSails);

        return this.profileService
          .find({
            _id: { $nin: peopleOnSails },
            [PROFILE_PROPS.STATUS]: PROFILE_STATUS.APPROVED,
            [PROFILE_PROPS.ROLES]: PROFILE_ROLES.SKIPPER,
          });
      });
  }

  @Get('available-crew')
  getAvailableCrew(@Query() query): Promise<IProfile[]> {
    return this.findOverlappingSail(query)
      .then((sails) => {
        const notCancelledSails = sails.filter(sail => sail.status !== SAIL_STATUS.CANCELLED);
        const peopleOnSails = this.getPeopleOnSails(notCancelledSails);

        return this.profileService
          .find({
            _id: { $nin: peopleOnSails },
            [PROFILE_PROPS.STATUS]: PROFILE_STATUS.APPROVED,
            [PROFILE_PROPS.ROLES]: PROFILE_ROLES.CREW,
          });
      });
  }

  @Get('available-members')
  getAvailableMembers(@Query() query): Promise<IProfile[]> {
    return this.findOverlappingSail(query)
      .then((sails) => {
        const notCancelledSails = sails.filter(sail => sail.status !== SAIL_STATUS.CANCELLED);
        const peopleOnSails = this.getPeopleOnSails(notCancelledSails);

        return this.profileService
          .find({
            _id: { $nin: peopleOnSails },
            [PROFILE_PROPS.STATUS]: PROFILE_STATUS.APPROVED,
            [PROFILE_PROPS.ROLES]: PROFILE_ROLES.MEMBER,
          });
      });
  }

  @Get('count-user-sails/:userId')
  countUserSails(@Req() req: Request, @Query() query: IQuery): Promise<number> {
    const userId = req.params.userId;

    const start = query.start;
    const end = query.end;

    delete query.start;
    delete query.end;

    let dateQuery;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      dateQuery = {
        $or: [
          { start: { $lt: startISO }, end: { $gte: startISO, $lte: endISO } },
          { start: { $gte: startISO, $lte: endISO }, end: { $gte: endISO } },
          { start: { $gte: startISO }, end: { $lte: endISO } },
        ],
      };
    } else if (start && !end) {
      const startDate = new Date(start);
      const startISO = startDate.toISOString();
      dateQuery = { start: { $gte: startISO } };
    } else if (end && !start) {
      const endDate = new Date(end);
      const endISO = endDate.toISOString();
      dateQuery = { end: { $lte: endISO } };
    }

    const finalQuery = {
      $and: [
        {
          $or: [
            { skipper: userId },
            { crew: userId },
            { passengers: userId },
          ],
        },
        {
          ...dateQuery,
        },
      ],
      ...query,
    };

    return this.service.count(finalQuery);
  }

  @Get('user-sails/:userId')
  getUserSails(@Req() req: Request, @Query() query: IQuery): Promise<ISail[]> {
    const userId = req.params.userId;

    const start = query.start;
    const end = query.end;

    delete query.start;
    delete query.end;

    let dateQuery;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      dateQuery = {
        $or: [
          { start: { $lt: startISO }, end: { $gte: startISO, $lte: endISO } },
          { start: { $gte: startISO, $lte: endISO }, end: { $gte: endISO } },
          { start: { $gte: startISO }, end: { $lte: endISO } },
        ],
      };
    } else if (start && !end) {
      const startDate = new Date(start);
      const startISO = startDate.toISOString();
      dateQuery = { start: { $gte: startISO } };
    } else if (end && !start) {
      const endDate = new Date(end);
      const endISO = endDate.toISOString();
      dateQuery = { end: { $lte: endISO } };
    }

    const finalQuery = {
      $and: [
        {
          $or: [
            { skipper: userId },
            { crew: userId },
            { passengers: userId },
          ],
        },
        {
          ...dateQuery,
        },
      ],
      ...query,
    };

    return this.service.find(finalQuery);
  }

  @Get('search')
  searchSails(@Query() query): Promise<ISail[]> {
    const boat = query.boat;
    const crew = query.crew;
    const end = query.end;
    const name = query.name;
    const passenger = query.passenger;
    const skipper = query.skipper;
    const start = query.start;
    const status = query.status;

    let nameQuery;

    if (name) {
      nameQuery = { name: new RegExp(name, 'gi') };
    }

    delete query.name;

    let statusQuery;

    if (status) {
      statusQuery = { status };
    }

    delete query.name;

    let boatQuery;

    if (boat === null || boat === 'null') {
      boatQuery = { $or: [{ boat: { $exists: false } }, { boat: null }] };
    } else if (boat) {
      boatQuery = { boat };
    }

    delete query.boat;

    let skipperQuery;

    if (skipper === null || skipper === 'null') {
      skipperQuery = { $or: [{ skipper: { $exists: false } }, { skipper: null }] };
    } else if (skipper) {
      skipperQuery = { skipper };
    }

    delete query.skipper;

    let crewQuery;

    if (crew === null || crew === 'null') {
      crewQuery = { $or: [{ crew: { $exists: false } }, { crew: null }] };
    } else if (crew) {
      crewQuery = { crew };
    }

    delete query.crew;

    let passengerQuery;

    if (passenger === null || passenger === 'null') {
      passengerQuery = {
        $or: [
          { passengers: { $exists: false } },
          { passengers: null },
          { passengers: [] },
        ],
      };
    } else if (passenger) {
      passengerQuery = { passengers: passenger };
    }

    delete query.passenger;

    let dateQuery;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      dateQuery = {
        $or: [
          { start: { $lt: startISO }, end: { $gte: startISO, $lte: endISO } },
          { start: { $gte: startISO, $lte: endISO }, end: { $gte: endISO } },
          { start: { $gte: startISO }, end: { $lte: endISO } },
        ],
      };
    } else if (start && !end) {
      const startDate = new Date(start);
      const startISO = startDate.toISOString();
      dateQuery = { start: { $gte: startISO } };
    } else if (end && !start) {
      const endDate = new Date(end);
      const endISO = endDate.toISOString();
      dateQuery = { end: { $lte: endISO } };
    }

    delete query.start;
    delete query.end;

    const andQuery = {
      $and: [
        { ...boatQuery || {} },
        { ...crewQuery || {} },
        { ...dateQuery || {} },
        { ...nameQuery || {} },
        { ...passengerQuery || {} },
        { ...skipperQuery || {} },
        { ...statusQuery || {} },
      ],
    };

    query.$and = andQuery.$and;

    return this.service.find(query);
  }

  @Post(':id/comment')
  postComment(@Req() req, @Param('id') id: string, @Body() comment: IComment): Promise<ISail> {
    const user: JwtObject = req.user;

    if (comment.author !== user.userId) {
      return Promise.reject(new Error('comment\'s author does not match user'));
    }

    comment.id = new mongoose.Types.ObjectId().toHexString();
    comment._id = comment.id;

    return this.service
      .updateByIdAnything(
        id,
        { $push: { comments: comment } },
      )
      .then((updatedSail) => {
        this.service
          .findById<ISailResolved>(
            id,
            { populate: ['comments.author', 'skipper', 'crew', 'passengers', 'cancelledBy'] },
          )
          .then((resolvedSail) => {
            this.emailService.emailUtils.sendSailNewComment(resolvedSail, comment, user);
          });
        return updatedSail;
      });
  }
}
