import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * @deprecated a description
     */
    prop: z
      .string()
      .openapi({ deprecated: true, description: 'a description' }),
  })
  .openapi({ description: 'object description' });
