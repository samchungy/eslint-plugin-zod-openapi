import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const ZodStringWithOpenApi = z.string().openapi({ description: 'test' });
