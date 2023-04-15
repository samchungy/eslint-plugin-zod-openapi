import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const ZodPrimative = z
  .record(z.string())
  .openapi({ description: 'test' });
