import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * correct description
     */
    prop: z.string().meta({ description: 'correct description' }),
  })
  .meta({ description: 'object description' });
