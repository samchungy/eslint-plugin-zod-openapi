import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * some description
 */
const a = z.string().openapi({ description: 'some description' });

/**
 * object description
 */
export const ZodObject = z
  .object({
    a,
  })
  .openapi({ description: 'object description' });
