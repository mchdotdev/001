/* eslint-disable @typescript-eslint/indent */
import { z } from 'zod';

export const offerDataSchema = z
  .object({
    title: z.string().min(10).max(50),
    description: z.string().min(10).max(100),
    image: z.string().url(),
    startsAt: z.number(),
    endsAt: z.number(),
  })
  .strict();
