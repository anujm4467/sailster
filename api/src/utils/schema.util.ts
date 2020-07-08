import * as mongoose from 'mongoose';

export const defaultSchemaOptions = {
  id: true,
  _id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
};

export const schema = (model, indexes = [], options: any = defaultSchemaOptions, virtuals = []) => {
  const newSchema = new mongoose.Schema(
    model,
    { ...defaultSchemaOptions, ...(options || {}) },
  );

  indexes.forEach(index => newSchema.index(index.fields, index.options));

  newSchema.set('toJSON', { getters: true, virtuals: true });
  newSchema.set('toObject', { getters: true, virtuals: true });
  newSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });

  virtuals.forEach((virtual) => {
    if (virtual.get) {
      newSchema.virtual(virtual.name, virtual.model).get(virtual.get);
    } else {
      newSchema.virtual(virtual.name, virtual.model);
    }
  });

  return newSchema;
};
