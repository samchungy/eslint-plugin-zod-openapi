import { z } from 'zod/v4';

export const ZodString = z.string().meta({ default: 'default' });
