import * as flatten from 'flatten-obj';
import {
  Body,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ICrudService } from './crud.interface';
import { IQuery } from './crud.service';

export interface AllowedRoutes {
  count?: boolean;
  create?: boolean;
  delete?: boolean;
  find?: boolean;
  findOne?: boolean;
  update?: boolean;
}

export class CrudController<T> {
  private readonly logger: Logger;
  protected readonly logError = error => this.logger.error(error.message, error.stack);
  protected readonly logInfo = message => this.logger.log(message);
  protected readonly service: ICrudService<T>;
  protected allowedRoutes: AllowedRoutes = {
    create: true,
    update: true,
    find: true,
    count: true,
    findOne: true,
    delete: true,
  };

  constructor(service: ICrudService<T>) {
    this.logger = new Logger(this.constructor.name);
    this.service = service;
  }

  @Post()
  create(@Req() _req, @Body() document: T, @Query() query: IQuery = {}): Promise<T> {
    if (this.allowedRoutes && !this.allowedRoutes.create) {
      return Promise.reject(new Error('Nothing here'));
    }

    return this.service
      .create(document, query)
      .catch((error) => {
        return Promise
          .reject(new InternalServerErrorException(error.message));
      });
  }

  @Patch(':id')
  update(@Req() _req, @Param('id') id: string, @Body() document: T, @Query() query: IQuery = {}): Promise<T> {
    if (this.allowedRoutes && !this.allowedRoutes.update) {
      return Promise.reject(new Error('Nothing here'));
    }

    const asis = (/^true$/i).test(query.asis);
    const flat = asis ? document : flatten()(document);
    return this.service.updateById(id, flat);
  }

  @Get('/count')
  count(@Query() query: IQuery = {}): Promise<number> {
    if (this.allowedRoutes && !this.allowedRoutes.count) {
      return Promise.reject(new Error('Nothing here'));
    }

    return this.service.count(query);
  }

  @Get()
  find<R>(@Query() query: IQuery = {}): Promise<R[]> {
    if (this.allowedRoutes && !this.allowedRoutes.find) {
      return Promise.reject(new Error('Nothing here'));
    }

    const text = query.text;

    if (text) {
      return this.service.text(text);
    }

    const substring = query.substring;
    const fields = query.fields;

    delete query.substring;
    delete query.fields;

    if (substring && fields) {
      return this.service.substring(fields, substring, query);
    }

    return this.service.find(query);
  }

  @Get(':id')
  findOne<R>(@Param('id') id: string, @Query() query: IQuery = {}): Promise<R> {
    if (this.allowedRoutes && !this.allowedRoutes.findOne) {
      return Promise.reject(new Error('Nothing here'));
    }

    return this.service.findById(id, query);
  }
}
