import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const run = () => {
  /**
   * correct description
   */
  const ZodString = z.string().openapi({ description: 'correct description' });

  return { ZodString };
};
