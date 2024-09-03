/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-useless-escape */
import { Schema, SchemaTypes, models, model } from 'mongoose';
import { IUser, UserModel, UserRoles } from '../types';

export const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: SchemaTypes.String,
      required: true,
      min: [8, '`name` has to be at least 8 characters long!'],
    },
    userId: {
      type: SchemaTypes.Number,
      required: true,
      unique: true,
    },
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Invalid email address'],
    },
    password: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      select: false,
    },
    phoneNumber: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
        'Invalide phone number',
      ],
    },
    avatar: {
      type: SchemaTypes.String,
      default: '/assets/icons/user.svg',
    },
    role: {
      type: SchemaTypes.Number,
      enum: UserRoles,
      default: UserRoles.MEMBER,
    },
    createdAt: {
      type: SchemaTypes.Number,
      default: Date.now(),
    },
    verified: {
      type: SchemaTypes.Boolean,
      default: false,
    },
  },
  {
    collection: 'users',
  },
);

export const User =
  (models.User as UserModel) || model<IUser, UserModel>('User', userSchema);
