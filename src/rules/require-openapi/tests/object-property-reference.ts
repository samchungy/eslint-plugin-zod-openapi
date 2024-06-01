import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * string description
 */
const ZodString = z.string().openapi({ description: 'string description' });

export const ZodObject = z
  .object({
    prop: ZodString,
  })
  .openapi({ description: 'object description' });
