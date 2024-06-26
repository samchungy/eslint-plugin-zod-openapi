import 'zod-openapi/extend';
import { z } from 'zod';

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
      .openapi({ description: 'prop description', example: 'hello' }),
  })
  .openapi({ description: 'object description' });

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
  .openapi({ description: 'new object description' });
