import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * a description
 */
export const ZodString = z.string().openapi({ description: 'a description' });
