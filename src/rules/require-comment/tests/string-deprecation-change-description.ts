import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * @deprecated a description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'a different', deprecated: true });
