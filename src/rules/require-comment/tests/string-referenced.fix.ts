import { z } from 'zod/v4';

/**
 * correct
 */
export const ZodString = z.string().meta({ description: 'correct' });

/**
 * correct
 */
export const CopyZodString = ZodString;
