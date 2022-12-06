import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
/**
 * @deprecated correct description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct description' });
