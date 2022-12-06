import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

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
