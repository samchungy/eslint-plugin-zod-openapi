import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * wrong
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
