import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * @deprecated a description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'a different', deprecated: true });
