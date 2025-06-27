import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * @deprecated correct description
     */
    prop: z.string().meta({ description: 'correct description' }),
  })
  .meta({ description: 'object description' });
