import 'zod-openapi/extend';
import { z } from 'zod';

export const run = () => {
  /**
   * wrong description
   */
  const ZodString = z.string().openapi({ description: 'correct description' });

  return { ZodString };
};
