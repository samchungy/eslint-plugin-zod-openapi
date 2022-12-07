import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * string description
 */
const ZodString = z.string().openapi({ description: 'string description' });

export const ZodObject = z
  .object({
    prop: ZodString,
  })
  .openapi({ description: 'object description' });
