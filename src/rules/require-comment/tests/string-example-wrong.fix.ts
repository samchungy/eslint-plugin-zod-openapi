import { z } from 'zod/v4';

/**
 * correct
 * @example "hello world"
 */
export const ZodString = z
  .string()
  .meta({ description: 'correct', example: 'hello world' });
