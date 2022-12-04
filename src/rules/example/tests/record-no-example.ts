import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ZodPrimative = z
  .record(z.string())
  .openapi({ description: 'test' });
