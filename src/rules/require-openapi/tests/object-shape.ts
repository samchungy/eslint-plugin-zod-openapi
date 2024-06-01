import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z
  .object({
    /**
     * prop
     */
    prop: z.string().openapi({ description: 'prop' }),
  })
  .openapi({ description: 'object description' });

export const shape = ZodObject.shape.prop;
