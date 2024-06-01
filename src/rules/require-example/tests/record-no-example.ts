import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodPrimative = z
  .record(z.string())
  .openapi({ description: 'test' });
