import 'zod-openapi/extend';
import { z } from 'zod';

export const a = z
  .object({
    a: z.string().openapi({ description: 'a prop' }),
  })
  .openapi({ description: 'object' });

export const ZodObject = z
  .object({
    prop: a.shape.a.optional(),
  })
  .openapi({ description: 'object description' });
