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
    /**
     * some description
     */
    a,
  })
  .openapi({ description: 'object description' });
