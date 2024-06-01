import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z
  .object({
    prop: z.string().openapi({ description: 'prop description' }),
  })
  .openapi({ description: 'object description' });
