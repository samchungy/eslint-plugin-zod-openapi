import { z } from 'zod/v4';

/**
 * object description
 */
export const ZodObject = z
  .object({
    /**
     * prop description
     * @example "hello"
     */
    prop: z
      .string()
      .meta({ description: 'prop description', example: 'hello' }),
  })
  .meta({ description: 'object description' });

/**
 * new object description
 */
export const NewZodObject = z
  .object({
    /**
     * prop description
     * @example "hello"
     */
    copyProp: ZodObject.shape.prop,
  })
  .meta({ description: 'new object description' });
