/* eslint-disable @typescript-eslint/indent */
import { z } from 'zod';

export const imageDataSchema = z
  .object({
    title: z.string().min(10).max(50),
    url: z.string().url(),
    metaData: z.object({
      width: z.number(),
      height: z.number(),
    }),
    publicId: z.string(),
  })
  .strict();
