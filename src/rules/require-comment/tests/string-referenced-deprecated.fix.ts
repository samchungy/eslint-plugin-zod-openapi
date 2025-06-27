import { z } from 'zod/v4';

/**
 * @deprecated correct
 */
export const ZodString = z
  .string()
  .meta({ description: 'correct', deprecated: true });

/**
 * @deprecated correct
 */
export const CopyZodString = ZodString;
