import 'zod-openapi/extend';
import { z } from 'zod';

/**
 * @deprecated correct
 */
export const ZodString = z
  .string()
  .openapi({ description: 'correct', deprecated: true });

/**
 * @deprecated correct
 */
export const CopyZodString = ZodString;
