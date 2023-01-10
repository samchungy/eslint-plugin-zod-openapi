import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ZodPrimative = z.enum(['a', 'b']).openapi({ description: 'test' });
