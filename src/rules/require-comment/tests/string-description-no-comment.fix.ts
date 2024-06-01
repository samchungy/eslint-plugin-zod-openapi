import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * a description
 */
export const ZodString = z.string().openapi({ description: 'a description' });
