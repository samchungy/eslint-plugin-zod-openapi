import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * correct
 */
export const ZodString = z.string().openapi({ description: 'correct' });

/**
 * correct
 */
export type ZodStringDef = z.infer<typeof ZodString>;
