import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z
  .object({
    prop: z.string(),
  })
  .openapi({ description: 'object description' });
