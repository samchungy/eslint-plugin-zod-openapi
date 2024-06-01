import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * prop description
     * @example "prop"
     */
    prop: z
      .string()
      .openapi({ description: 'prop description', example: 'prop' }),
  })
  .openapi({ description: 'object description' });
