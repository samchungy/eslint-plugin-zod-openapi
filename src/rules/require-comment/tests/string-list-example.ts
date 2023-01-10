import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * a list of strings
 * @example ['hello']
 */
export const ZodStringList = z
  .array(z.string())
  .openapi({ description: 'a list of strings', example: ['hello'] });
