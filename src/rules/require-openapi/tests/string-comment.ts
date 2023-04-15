import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

/**
 * String with comment
 */
export const ZodStringWithComment = z.string();
