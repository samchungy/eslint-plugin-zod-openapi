import { z } from 'zod/v4';
/**
 * correct description
 */
export const ZodString = z
  .string()
  .meta({ description: 'correct description' });
