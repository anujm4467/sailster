import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { ICrudService } from './crud.interface';

const populate = (model, populationData: string[]) => {
  const population = populationData.map((data: string) => {
    const tmp = data.split(',');
    return {
      path: tmp[0],
      select: tmp.slice(1).join(' '),
    };
  });

  population.forEach(pop => model.populate(pop));

  return model;
};

export interface IQuery {
  limit?: number;
  sort?: string[];
  populate?: string[];
  [x: string]: any;
}

export class CrudService<T> implements ICrudService<T> {
  private random = Math.random();
  private readonly logger: Logger;
  private readonly model: Model<T>;
  static instance = 0;

  constructor(model: Model<T>) {
    this.model = model;
    this.logger = new Logger(this.constructor.name);

    CrudService.instance = CrudService.instance + 1;

    this.logger.log(`from constructor random ${this.random}; instance = ${CrudService.instance}`);

    this.model
      .on('index', (error) => {
        if (error) {
          this.logger.error(`${this.model.modelName} index error: ${error}`);
        } else {
          this.logger.log(`${this.model.modelName} index created`);
        }
      });
  }

  async create(document: T, query: IQuery = {}): Promise<T> {
    const newDocument = new this.model(document);

    const populateData = ([].concat(query.populate || []));
    delete query.populate;

    populate(newDocument, populateData);

    return await newDocument.save({ populate: true });
  }

  async updateById(id: string, document: T, query: IQuery = {}, options: any = {}): Promise<T> {

    const populateData = ([].concat(query.populate || []));
    delete query.populate;

    const update = this.model
      .findOneAndUpdate({ _id: id }, { $set: document }, { new: true, ...options });

    populate(update, populateData);

    return await update.exec();
  }

  findAndUpdate(where: any, document: T): Promise<T> {

    const update = this.model
      .findOneAndUpdate(where, { $set: document }, { new: true });

    return update.exec();
  }

  async updateByIdAnything(id: string, documentWithInstructions: any, query: IQuery = {}, withNew = true): Promise<T> {

    const populateData = ([].concat(query.populate || []));
    delete query.populate;

    const update = this.model
      .findOneAndUpdate({ _id: id }, documentWithInstructions, { new: withNew });

    populate(update, populateData);

    return await update.exec();
  }

  async findOne<R>(query: IQuery): Promise<R> {
    return this.find(query)
      .then((documents: R[]) => documents[0] as R);
  }

  async find<R>(query: IQuery): Promise<R[]> {
    const parsedQuery = Object
      .keys(query)
      .reduce(
        (red, key) => {
          if (key.startsWith('<')) {
            red[key.substring(1)] = { $lt: query[key] };
          } else if (key.startsWith('>')) {
            red[key.substring(1)] = { $gt: query[key] };
          } else {
            red[key] = query[key];
          }
          return red;
        },
        {} as IQuery,
      );

    const limit = +parsedQuery.limit;
    delete parsedQuery.limit;

    /*
      from mongoose documentation
      // sort by "field" ascending and "test" descending
      query.sort({ field: 'asc', test: -1 });

      // equivalent
      query.sort('field -test');
    */
    const sort = ([].concat(parsedQuery.sort || [])).join(' ');
    delete parsedQuery.sort;

    const populateData = ([].concat(parsedQuery.populate || []));
    delete parsedQuery.populate;

    const not = ([].concat(parsedQuery.not || []));
    delete parsedQuery.not;

    let finalQuery;

    if (not.length) {
      finalQuery = { _id: { $nin: not }, ...parsedQuery };
    } else {
      finalQuery = parsedQuery;
    }

    const search = this.model
      .find(finalQuery)
      .sort(sort)
      .limit(limit);

    populate(search, populateData);

    const documents = await search.exec();
    return documents;
  }

  async count(query: IQuery = {}): Promise<number> {
    return await this.model
      .count(query)
      .exec();
  }

  async findById<R>(id: string, query: IQuery = {}): Promise<R> {
    const populateData = ([].concat(query.populate || []));
    delete query.populate;

    const search = this.model.findById(id);

    populate(search, populateData);

    return await search.exec();
  }

  async text<R>(text: string): Promise<R[]> {
    return await this.model.find({ $text: { $search: text } }).exec();
  }

  async substring<R>(fields: string[], text: string, query: IQuery = {}): Promise<R[]> {
    const fieldsArray = [].concat(fields);
    const searchFields = fieldsArray.map(field => ({ [field]: new RegExp(text, 'gi') }));

    const finalQuery = {
      $or: searchFields,
      ...query,
    };

    return this.find(finalQuery);
  }

  async removeOne(query: any): Promise<any> {
    return this.model
      .deleteOne(query)
      .exec();
  }

  async removeAll(query: any): Promise<any> {
    return this.model
      .deleteMany(query)
      .exec();
  }
}
