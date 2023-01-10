import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * correct
 * @example 'hello world'
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
