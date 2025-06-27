import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({ prop2: z.string(), 
                               /**
                                * prop description
                                */
                               prop: z.string().meta({ description: 'prop description' }) })
  .meta({ description: 'object description' });
