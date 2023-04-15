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
     */
    prop: z.string().openapi({ description: 'prop description' }),
  })
  .openapi({ description: 'object description' });

/**
 * new object description
 */
export const NewZodObject = z
  .object({
    /**
     * prop description
     */
    copyProp: ZodObject.shape.prop,
  })
  .openapi({ description: 'new object description' });
