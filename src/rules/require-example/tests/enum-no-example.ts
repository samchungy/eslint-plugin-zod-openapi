import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const ZodPrimative = z.enum(['a', 'b']).openapi({ description: 'test' });
