import { z } from 'zod/v4';

export const ZodString = z
  .string()
  .optional()
  .meta({ description: 'optional string' });
