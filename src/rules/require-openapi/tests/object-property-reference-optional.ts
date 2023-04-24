import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * string description
 */
const ZodString = z.string().openapi({ description: 'string description' });

export const ZodObject = z
  .object({
    prop: ZodString.optional(),
  })
  .openapi({ description: 'object description' });
