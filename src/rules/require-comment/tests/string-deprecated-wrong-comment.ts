import { z } from 'zod/v4';

/**
 * wrong description
 */
export const ZodString = z
  .string()
  .meta({ deprecated: true, description: 'a description' });
