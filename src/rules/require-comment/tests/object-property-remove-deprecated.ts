import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

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
