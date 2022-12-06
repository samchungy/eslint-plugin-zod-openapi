import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * object description
 */
export const ZodObject = z
  .object({ prop2: z.string(), prop: z.string().openapi({ description: 'prop description' }) })
  .openapi({ description: 'object description' });
