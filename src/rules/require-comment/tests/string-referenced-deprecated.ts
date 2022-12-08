import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * @deprecated correct
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', deprecated: true });

export const CopyZodString = ZodString;
