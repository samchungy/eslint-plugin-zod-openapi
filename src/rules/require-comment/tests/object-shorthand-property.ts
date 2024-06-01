import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * some description
 */
const a = z.string().openapi({ description: 'some description' });

/**
 * object description
 */
export const ZodObject = z
  .object({
    a,
  })
  .openapi({ description: 'object description' });
