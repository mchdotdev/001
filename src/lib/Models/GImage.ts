/* eslint-disable @typescript-eslint/indent */
import { SchemaTypes, model, models, Schema, MongooseError } from 'mongoose';
import { GImageDocument, GImageMethods, GImageModel, IGImage } from '../types';

export const imageSchema = new Schema<IGImage, GImageModel, GImageMethods>(
  {
    publicId: {
      type: SchemaTypes.String,
      required: true,
    },
    title: {
      type: SchemaTypes.String,
      required: true,
      default: 'Taken at Power Gym Check it out!',
      minlength: [10, 'Title should be at least 10 characters long.'],
      maxLength: [50, 'Title cannot exceed 50 characters in length.'],
    },
    url: {
      type: SchemaTypes.String,
      required: true,
    },
    metaData: {
      width: {
        type: SchemaTypes.Number,
        required: true,
      },
      height: {
        type: SchemaTypes.Number,
        required: true,
      },
    },
    createdAt: {
      type: SchemaTypes.Number,
      default: Date.now(),
    },
  },
  {
    collection: 'images',
    methods: {
      async setTitle(this: GImageDocument, title: string): Promise<void> {
        if (title.length < 10 || title.length > 50) {
          throw new MongooseError(
            '`title` property can be between 10 and 50 characters long.',
          );
        }
        this.title = title;
        await this.save();
      },
    },
  },
);

export const GImage =
  (models.GImage as GImageModel) ||
  model<IGImage, GImageModel>('GImage', imageSchema);
