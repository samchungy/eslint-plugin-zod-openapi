import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

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
