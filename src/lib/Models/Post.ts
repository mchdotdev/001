/* eslint-disable @typescript-eslint/indent */
import { Schema, SchemaTypes, models, model } from 'mongoose';
import { IPost, PostModel } from '../types';

export const postSchema = new Schema<IPost, PostModel>(
  {
    title: {
      type: SchemaTypes.String,
      required: true,
      minlength: [10, 'Title should be at least 10 characters long.'],
      maxlength: [1000, 'Title cannot exceed 100 characters.'],
    },
    coverUrl: {
      type: SchemaTypes.String,
      required: true,
      validate: {
        validator: function (v: string): boolean {
          return /\/assets\/logo\.png|^https:\/\/res\.cloudinary\.com\/decc00n\/image.+\.png|jpeg|jpg|svg$/g.test(
            v,
          );
        },
      },
      default: '/assets/logo.png',
    },
    markdown: {
      type: SchemaTypes.String,
      required: true,
    },
    author: {
      type: SchemaTypes.Number,
      immutable: true,
    },
    createdAt: {
      type: SchemaTypes.Number,
      default: Date.now(),
    },
    lastModified: {
      type: SchemaTypes.Number,
      default: Date.now(),
    },
  },
  {
    collection: 'posts',
  },
);

export const Post =
  (models.Post as PostModel) || model<IPost, PostModel>('Post', postSchema);
