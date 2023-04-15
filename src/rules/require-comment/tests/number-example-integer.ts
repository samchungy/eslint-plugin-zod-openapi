import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * a number
 * @example 1
 */
export const ZodNumber = z
  .number()
  .openapi({ description: 'a number', example: 1 });
