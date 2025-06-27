import { z } from 'zod/v4';

export const a = z
  .object({
    a: z.string().meta({ description: 'a prop' }),
  })
  .meta({ description: 'object' });

export const ZodObject = z
  .object({
    prop: a.shape.a.optional(),
  })
  .meta({ description: 'object description' });
