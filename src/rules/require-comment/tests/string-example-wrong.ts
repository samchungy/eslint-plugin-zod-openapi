import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * wrong
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
