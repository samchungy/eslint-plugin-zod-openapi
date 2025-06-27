import { z } from 'zod/v4';

/**
 * @deprecated correct
 */
export const ZodString = z
  .string()
  .meta({ description: 'correct', deprecated: true });

export const CopyZodString = ZodString;
