import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * correct
 */
export const ZodString = z.string().openapi({ description: 'correct' });

/**
 * correct
 */
export const CopyZodString = ZodString;
