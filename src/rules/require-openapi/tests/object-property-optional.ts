import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z
  .object({
    prop: z.string().optional(),
  })
  .openapi({ description: 'object description' });
