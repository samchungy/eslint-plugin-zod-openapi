import { z } from 'zod/v4';

/**
 * a string
 */
export const ZodString = z.string().meta({ description: 'a string' });

export const OptionalString = ZodString.optional();
