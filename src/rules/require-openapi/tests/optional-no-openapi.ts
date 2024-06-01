import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * a string
 */
export const ZodString = z.string().openapi({ description: 'a string' });

export const OptionalString = ZodString.optional();
