import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * @deprecated a description
 */
export const ZodString = z
  .string()
  .openapi({ deprecated: true, description: 'a description' });
