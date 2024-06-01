import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * @deprecated correct description
     */
    prop: z.string().openapi({ description: 'correct description' }),
  })
  .openapi({ description: 'object description' });
