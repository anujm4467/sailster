import { IQuery } from './crud.service';

export interface ICrudService<T> {
  count(query?: IQuery): Promise<number>;
  create(document: T, query?: IQuery): Promise<T>;
  find<R>(query: IQuery): Promise<R[]>;
  findOne<R>(query: IQuery): Promise<R>;
  findById<R>(id: string, query?: IQuery): Promise<R>;
  substring<R>(fields: string[], text: string, query?: IQuery): Promise<R[]>;
  text<R>(query: string): Promise<R[]>;
  updateById(id: string, document: T, query?: IQuery, options?: any): Promise<T>;
  updateByIdAnything(id: string, documentWithInstructions: any, query?: IQuery, withNew?: boolean): Promise<T>;
  removeOne(query: IQuery): Promise<any>;
  findAndUpdate(where: any, document: T): Promise<T>;
  removeAll(query: IQuery): Promise<any>;
}
