import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * @deprecated prop description
     */
    prop: z
      .string()
      .openapi({ deprecated: true, description: 'prop description' }),
  })
  .openapi({ description: 'object description' });
