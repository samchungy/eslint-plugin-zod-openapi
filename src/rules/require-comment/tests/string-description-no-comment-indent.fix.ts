import { z } from 'zod/v4';

export const run = () => {
  /**
   * a description
   */
  const ZodString = z.string().meta({ description: 'a description' });

  return { ZodString };
};
