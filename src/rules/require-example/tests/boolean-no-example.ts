import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodPrimative = z.boolean().openapi({ description: 'test' });
