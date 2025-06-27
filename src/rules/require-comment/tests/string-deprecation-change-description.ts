import { z } from 'zod/v4';

/**
 * @deprecated a description
 */
export const ZodString = z
  .string()
  .meta({ description: 'a different', deprecated: true });
