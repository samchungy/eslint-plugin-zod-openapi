import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * object description
 */
export const ZodObject = z
  .object({
    prop: z.string().openapi({ description: 'prop description' }),
  })
  .openapi({ description: 'object description' });
