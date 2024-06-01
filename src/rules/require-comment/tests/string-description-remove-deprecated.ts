import 'zod-openapi/extend';
import { z } from 'zod';
/**
 * @deprecated correct description
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct description' });
