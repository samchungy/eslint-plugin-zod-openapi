import 'zod-openapi/extend';
import { z } from 'zod';

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
    copyProp: ZodObject.shape.prop,
  })
  .openapi({ description: 'new object description' });
