import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * a description
 */
export const ZodString = z.string().openapi({ description: 'a description' });
