import { z } from 'zod/v4';

export const run = () => {
  const ZodString = z.string().meta({ description: 'a description' });

  return { ZodString };
};
