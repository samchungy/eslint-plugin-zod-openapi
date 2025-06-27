import { z } from 'zod/v4';

/**
 * a list of strings
 */
export const ZodStringList = z
  .array(z.string())
  .meta({ description: 'a list of strings', example: ['hello'] });
