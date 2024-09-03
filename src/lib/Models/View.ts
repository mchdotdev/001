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

export const View =
  (models.View as ViewModel) || model<IView, ViewModel>('View', viewSchema);
