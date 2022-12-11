import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * correct
 */
export const ZodString = z.string().openapi({ description: 'correct' });

/**
 * correct
 */
export type ZodStringDef = z.infer<typeof ZodString>;
