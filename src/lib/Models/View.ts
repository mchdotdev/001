/* eslint-disable @typescript-eslint/indent */
import { Schema, SchemaTypes, models, model } from 'mongoose';
import { IView, ViewModel } from '../types';

export const viewSchema = new Schema<IView, ViewModel>(
  {
    ip: {
      type: SchemaTypes.String,
      required: true,
    },
    routeVisited: {
      type: SchemaTypes.String,
      required: true,
    },
    count: {
      type: SchemaTypes.Number,
      default: 0,
    },
    createdAt: {
      type: SchemaTypes.Date,
      default: Date.now,
    },
  },
  {
    collection: 'views',
  },
);

viewSchema.index(
  { 'createdAt': 1 },
  { expireAfterSeconds: 60 * 60 * 24 * lifetime },
);

export const View =
  (models.View as ViewModel) || model<IView, ViewModel>('View', viewSchema);
