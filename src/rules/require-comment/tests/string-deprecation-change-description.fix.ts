import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * @deprecated a different
 */
export const ZodString = z
  .string()
  .openapi({ description: 'a different', deprecated: true });
