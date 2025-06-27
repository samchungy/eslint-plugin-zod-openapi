import { z } from 'zod/v4';

/**
 * a description
 * @example "multiple"
 */
export const ZodString = z.string().meta({
  description: 'a description',
  default: 'hello',
  examples: ['multiple', 'examples'],
});
