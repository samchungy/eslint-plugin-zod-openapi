import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodPrimative = z.enum(['a', 'b']).openapi({ description: 'test' });
