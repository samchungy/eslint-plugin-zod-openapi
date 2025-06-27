import { z } from 'zod/v4';

export const ZodPrimative = z.enum(['a', 'b']).meta({ description: 'test' });
