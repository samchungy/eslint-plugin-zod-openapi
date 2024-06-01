import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodObject = z.object({
  prop: z.string().openapi({ description: 'a description' }).default('a'),
});
