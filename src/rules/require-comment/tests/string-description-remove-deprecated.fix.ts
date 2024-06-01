import 'zod-openapi/extend';
import { z } from 'zod';
/**
 * correct description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct description' });
