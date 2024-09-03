/* eslint-disable @typescript-eslint/indent */
import { z } from 'zod';

export const postDataSchema = z
  .object({
    title: z.string().min(10).max(1000),
    markdown: z.string(),
    coverUrl: z.string().url().optional(),
  })
  .strict();
