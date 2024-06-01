import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * correct
 * @example "hello world"
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', example: 'hello world' });
