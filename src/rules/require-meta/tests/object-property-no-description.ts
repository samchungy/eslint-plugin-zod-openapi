import { z } from 'zod/v4';

export const ZodObject = z
  .object({
    prop: z.string(),
  })
  .meta({ description: 'object description' });
