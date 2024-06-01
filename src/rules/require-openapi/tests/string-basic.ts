import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodStringWithOpenApi = z.string().openapi({ description: 'test' });
