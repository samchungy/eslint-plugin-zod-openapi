import { z } from 'zod/v4';

/**
 * a number
 * @example 1
 */
export const ZodNumber = z
  .number()
  .meta({ description: 'a number', example: 1 });
