import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

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
