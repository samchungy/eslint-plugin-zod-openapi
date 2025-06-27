import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * prop description
     */
    prop: z.string().meta({ description: 'prop description' }),
  })
  .meta({ description: 'object description' });

/**
 * new object description
 */
export const NewZodObject = z
  .object({
    copyProp: ZodObject.shape.prop,
  })
  .meta({ description: 'new object description' });
