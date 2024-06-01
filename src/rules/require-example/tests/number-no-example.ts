import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodPrimative = z.number().openapi({ description: 'test' });
