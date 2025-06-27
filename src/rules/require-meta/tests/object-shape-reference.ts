import { z } from 'zod/v4';

export const ZodObject = z
  .object({
    /**
     * prop
     */
    prop: z.string().meta({ description: 'prop' }),
  })
  .meta({ description: 'object description' });

export const ZodObjectReference = z
  .object({
    ref: ZodObject.shape.prop,
  })
  .meta({ description: 'object reference' });
