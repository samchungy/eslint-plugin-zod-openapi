import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * wrong description
     */
    prop: z.string().openapi({ description: 'correct description' }),
  })
  .openapi({ description: 'object description' });
