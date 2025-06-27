import { z } from 'zod/v4';

export const run = () => {
  /**
   * correct description
   */
  const ZodString = z.string().meta({ description: 'correct description' });

  return { ZodString };
};
