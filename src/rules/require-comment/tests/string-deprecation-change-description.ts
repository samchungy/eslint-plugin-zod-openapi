import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * @deprecated a description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'a different', deprecated: true });
