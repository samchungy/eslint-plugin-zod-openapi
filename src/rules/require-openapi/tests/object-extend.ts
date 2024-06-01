import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z
  .object({
    prop: z.string().openapi({ description: 'prop' }),
  })
  .openapi({ description: 'object description' });

export const extended = ZodObject.extend({
  prop2: z.string().openapi({ description: 'prop2' }),
});
