import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * a string
 */
export const ZodString = z.string().openapi({ description: 'a string' });

export const OptionalString = ZodString.optional();
