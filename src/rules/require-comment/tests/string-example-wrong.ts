import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * wrong
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
