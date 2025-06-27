import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * prop description
     * @example "prop"
     */
    prop: z.string().meta({ description: 'prop description', example: 'prop' }),
  })
  .meta({ description: 'object description' });
