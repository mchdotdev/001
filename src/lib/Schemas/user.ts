/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/indent */
import { z } from 'zod';
import { UserRoles } from '../types';

export const userDataSchema = z
  .object({
    name: z.string().min(8),
    email: z
      .string()
      .email()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
    password: z.string().min(8),
    phoneNumber: z
      .string()
      .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g),
  })
  .strict();

export const userSessionSchema = z
  .object({
    _id: z.string(),
    name: z.string().min(8),
    userId: z.number(),
    email: z.string().email(),
    avatar: z.string(),
    createdAt: z.number(),
    role: z.number().min(UserRoles.MEMBER).max(UserRoles.DEVELOPER),
    lastUpdatedTimestamp: z.number(),
  })
  .strict();
