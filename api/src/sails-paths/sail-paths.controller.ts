import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IPosition } from '../shared/sail-path/position.interface';
import {
  ISailPath,
  SAIL_PATH_PROPS,
} from '../shared/sail-path/sail-path.interface';
import { JwtObject } from '../shared/token/jwt-object.interface';
import { SailPathsService } from './sail-paths.service';

@Controller('sail-paths')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailPathsController extends CrudController<ISailPath> {
  constructor(service: SailPathsService) {
    super(service);
  }

  @Post(':id/add-positions')
  addLocations(@Req() req, @Param('id') sailPathId, @Body() positions: IPosition[]): Promise<void> {
    return this.service
      .findById<ISailPath>(sailPathId)
      .then((sailPath) => {
        const user: JwtObject = req.user;
        if (user.userId !== sailPath.submittedBy.toString()) {
          return Promise.reject(new Error('User does not match sail path submitter.'));
        }
        return this.service
          .updateByIdAnything(sailPathId, { $push: { [SAIL_PATH_PROPS.POSITIONS]: { $each: positions } } }, {}, false)
          .then(() => {
            return;
          })
          .catch((error) => {
            return Promise
              .reject(new InternalServerErrorException(error.message));
          });
      });
  }
}
