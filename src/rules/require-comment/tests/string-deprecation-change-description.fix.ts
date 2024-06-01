import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * @deprecated a different
 */
export const ZodString = z
  .string()
  .openapi({ description: 'a different', deprecated: true });
