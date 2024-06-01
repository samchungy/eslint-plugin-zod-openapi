import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * a number
 * @example 1
 */
export const ZodNumber = z
  .number()
  .openapi({ description: 'a number', example: 1 });
