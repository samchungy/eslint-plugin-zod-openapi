import { z } from 'zod/v4';

/**
 * wrong
 */
export const ZodString = z
  .string()
  .meta({ description: 'correct', example: 'hello world' });
