import * as mongoose from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import {
  IChallenge,
  IChallenger,
} from '../shared/challenge/challenge.interface';
import { IComment } from '../shared/comment/comment.interface';
import { IMedia } from '../shared/media/media.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';
import { ChallengesService } from './challenges.service';

@Controller('challenges')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, UserAccessGuard)
export class ChallengesController extends CrudController<IChallenge> {
  constructor(
    service: ChallengesService,
  ) {
    super(service);
  }

  @Post()
  @SetMetadata('access', [USER_ACCESS_FIELDS.CREATE_CHALLENGE])
  create(@Req() req, @Body() document, @Query() query) {
    return super.create(req, document, query);
  }

  @Patch(':id')
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_CHALLENGE])
  update(@Req() req, @Param('id') id: string, @Body() document, @Query() query) {
    return super.update(req, id, document, query);
  }

  @Patch('/add-pictures/:challengeId')
  addPictures(@Req() request, @Param('challengeId') challengeId: string, @Body() pictures: IMedia[]) {
    const user: JwtObject = request.user;

    if (!user) {
      return Promise.reject(new Error('Not authrorized'));
    }

    pictures.forEach((picture) => {
      picture.id = new mongoose.Types.ObjectId().toHexString();
      picture._id = picture.id;
      picture.author = user.profileId;
    });

    return this.service
      .updateByIdAnything(
        challengeId, { $push: { pictures: { $each: pictures } } });
  }

  @Delete('/remove-picture/:challengeId/:pictureId')
  deletePicture(@Param('challengeId') challengeId: string, @Param('pictureId') pictureId: string) {
    return this.service.updateByIdAnything(challengeId, { $pull: { pictures: { _id: pictureId } } });
  }

  @Patch(':challengeId/comment')
  postComment(@Req() req, @Param('challengeId') challengeId: string, @Body() comment: IComment): Promise<IChallenge> {
    const user: JwtObject = req.user;

    if (comment.author !== user.userId) {
      return Promise.reject(new Error('comment\'s author does not match user'));
    }

    comment.id = new mongoose.Types.ObjectId().toHexString();
    comment._id = comment.id;

    return this.service
      .updateByIdAnything(
        challengeId,
        { $push: { comments: comment } },
      );
  }

  @Patch(':challengeId/accomplished-by/:profileId')
  accomplishedBy(
    @Req() req,
    @Param('challengeId') challengeId: string,
    @Param('profileId') profileId: string,
  ): Promise<IChallenge> {
    const user: JwtObject = req.user;

    if (profileId !== user.userId) {
      return Promise.reject(new Error('profile id does not match user id'));
    }

    const completedBy: IChallenger = { profile: profileId, completedOn: new Date() };

    return this.service
      .updateByIdAnything(
        challengeId,
        { $push: { completedBy } },
      );
  }
}
