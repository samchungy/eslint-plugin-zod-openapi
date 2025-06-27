import { z } from 'zod/v4';

/**
 * string description
 */
const ZodString = z.string().meta({ description: 'string description' });

export const ZodObject = z
  .object({
    prop: ZodString.optional(),
  })
  .meta({ description: 'object description' });
