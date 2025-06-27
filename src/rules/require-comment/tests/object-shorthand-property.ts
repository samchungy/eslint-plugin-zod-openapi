import { z } from 'zod/v4';

/**
 * some description
 */
const a = z.string().meta({ description: 'some description' });

/**
 * object description
 */
export const ZodObject = z
  .object({
    a,
  })
  .meta({ description: 'object description' });
