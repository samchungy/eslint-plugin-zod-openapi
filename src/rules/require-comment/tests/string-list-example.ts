import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * a list of strings
 */
export const ZodStringList = z
  .array(z.string())
  .openapi({ description: 'a list of strings', example: ['hello'] });
