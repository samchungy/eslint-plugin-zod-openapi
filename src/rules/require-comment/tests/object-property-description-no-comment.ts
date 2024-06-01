import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * object description
 */
export const ZodObject = z
  .object({
    prop: z.string().openapi({ description: 'prop description' }),
  })
  .openapi({ description: 'object description' });
