import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const ZodObject = z
  .object({
    prop: z.string().openapi({ description: 'prop description' }),
  })
  .openapi({ description: 'object description' });
