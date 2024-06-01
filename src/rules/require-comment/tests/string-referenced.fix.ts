import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * correct
 */
export const ZodString = z.string().openapi({ description: 'correct' });

/**
 * correct
 */
export const CopyZodString = ZodString;
