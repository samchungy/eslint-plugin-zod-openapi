import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * a string
 */
export const ZodString = z.string().openapi({ description: 'a string' });

export const OptionalString = ZodString.optional();
