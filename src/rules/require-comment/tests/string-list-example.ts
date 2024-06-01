import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * a list of strings
 */
export const ZodStringList = z
  .array(z.string())
  .openapi({ description: 'a list of strings', example: ['hello'] });
