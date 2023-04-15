import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * wrong description
 */
export const ZodString = z
  .string()
  .openapi({ deprecated: true, description: 'a description' });
