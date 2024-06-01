import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * a description
 * @example "multiple"
 */
export const ZodString = z.string().openapi({
  description: 'a description',
  default: 'hello',
  examples: ['multiple', 'examples'],
});
