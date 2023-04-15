import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * correct
 * @example "hello world"
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
