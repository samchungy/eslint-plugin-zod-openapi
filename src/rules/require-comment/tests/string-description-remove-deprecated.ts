import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);
/**
 * @deprecated correct description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct description' });
