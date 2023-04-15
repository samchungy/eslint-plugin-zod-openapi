import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * @deprecated correct
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', deprecated: true });

/**
 * @deprecated correct
 */
export const CopyZodString = ZodString;
