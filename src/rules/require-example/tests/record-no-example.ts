import { z } from 'zod/v4';

export const ZodPrimative = z
  .record(z.string(), z.string())
  .meta({ description: 'test' });
