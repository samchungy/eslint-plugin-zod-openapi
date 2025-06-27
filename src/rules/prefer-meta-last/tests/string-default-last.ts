import { z } from 'zod/v4';

export const ZodString = z
  .string()
  .meta({ description: 'a description' })
  .default('a');
