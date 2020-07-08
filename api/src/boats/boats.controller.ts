import {
  Body,
  Controller,
  Inject,
  Post,
  SetMetadata,
  UseGuards,
  Patch,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { InstructionsService } from '../instructions/instructions.service';
import { IBoat } from '../shared/boat/boat.interface';
import { PROFILE_ROLES } from '../shared/profile/profile-roles.enum';
import { BoatsService } from './boats.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { Request } from 'express';
import { IInstructions } from '../shared/instructions/instructions.interface';
import { INSTRUCTIONS } from '../shared/instructions/instructions';

@Controller('boats')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class BoatsController extends CrudController<IBoat> {
  constructor(
    service: BoatsService,
    @Inject(InstructionsService) private instructionsService: InstructionsService) {
    super(service);
  }

  @Post()
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.FLEET_MANAGER])
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
  @SetMetadata('roles', [PROFILE_ROLES.ADMIN, PROFILE_ROLES.FLEET_MANAGER])
  update(@Req() req, @Param('id') id: string, @Body() document: IBoat, @Query() query?): Promise<IBoat> {
    return super.update(req, id, document, query);
  }
}
