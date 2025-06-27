import { z } from 'zod/v4';

export const ZodStringWithOpenApi = z.string().meta({ description: 'test' });
