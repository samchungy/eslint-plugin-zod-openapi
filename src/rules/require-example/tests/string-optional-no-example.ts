import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodString = z
  .string()
  .optional()
  .openapi({ description: 'optional string' });
