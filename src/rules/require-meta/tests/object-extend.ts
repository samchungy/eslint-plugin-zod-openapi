import { z } from 'zod/v4';

export const ZodObject = z
  .object({
    prop: z.string().meta({ description: 'prop' }),
  })
  .meta({ description: 'object description' });

export const extended = ZodObject.extend({
  prop2: z.string().meta({ description: 'prop2' }),
});
