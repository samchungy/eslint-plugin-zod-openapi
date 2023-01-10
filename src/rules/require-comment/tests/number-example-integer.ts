import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * a number
 * @example 1
 */
export const ZodNumber = z
  .number()
  .openapi({ description: 'a number', example: 1 });
