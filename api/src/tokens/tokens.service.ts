import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ITokenModel } from '../shared/token/token-model.interface';

@Injectable()
export class TokensService extends CrudService<ITokenModel> {
  constructor(@Inject('TOKEN_MODEL') tokenModel: Model<ITokenModel>) {
    super(tokenModel);
  }
}
