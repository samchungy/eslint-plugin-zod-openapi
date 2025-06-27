import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    prop: z
      .string()
      .meta({ deprecated: true, description: 'prop description' }),
  })
  .meta({ description: 'object description' });
