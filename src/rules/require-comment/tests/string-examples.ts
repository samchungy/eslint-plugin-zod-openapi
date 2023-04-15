import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * a description
 * @example "multiple"
 */
export const ZodString = z.string().openapi({
  description: 'a description',
  default: 'hello',
  examples: ['multiple', 'examples'],
});
