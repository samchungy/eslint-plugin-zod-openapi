import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * object description
 */
export const ZodObject = z
  .object({
    prop: z.string().openapi({ deprecated: true }),
  })
  .openapi({ description: 'object description' });
