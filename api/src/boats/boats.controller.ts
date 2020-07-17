import { Request } from 'express';
import {
  Body,
  Controller,
  Inject,
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
import { InstructionsService } from '../instructions/instructions.service';
import { IBoat } from '../shared/boat/boat.interface';
import { INSTRUCTIONS } from '../shared/instructions/instructions';
import { IInstructions } from '../shared/instructions/instructions.interface';
import { USER_ACCESS_FIELDS } from '../shared/user-access/user-access.interface';
import { BoatsService } from './boats.service';

@Controller('boats')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class BoatsController extends CrudController<IBoat> {
  constructor(
    service: BoatsService,
    @Inject(InstructionsService) private instructionsService: InstructionsService) {
    super(service);
  }

  @Post()
  @SetMetadata('access', [USER_ACCESS_FIELDS.CREATE_BOAT])
  @UseGuards(UserAccessGuard)
  createBoat(@Req() req: Request, @Body() data) {
    const departureInstructions: IInstructions = { instructionsType: INSTRUCTIONS.DEPARTURE };
    const arrivalInstructions: IInstructions = { instructionsType: INSTRUCTIONS.ARRIVAL };

    return super.create(req, data)
      .then((boat) => {
        this.instructionsService
          .create({ ...departureInstructions, boatId: boat.id })
          .catch(error => this.logError(error));
        this.instructionsService
          .create({ ...arrivalInstructions, boatId: boat.id })
          .catch(error => this.logError(error));
        return boat;
      });
  }

  @Patch(':id')
  @SetMetadata('access', [USER_ACCESS_FIELDS.EDIT_BOAT])
  @UseGuards(UserAccessGuard)
  update(@Req() req, @Param('id') id: string, @Body() document: IBoat, @Query() query?): Promise<IBoat> {
    return super.update(req, id, document, query);
  }
}
