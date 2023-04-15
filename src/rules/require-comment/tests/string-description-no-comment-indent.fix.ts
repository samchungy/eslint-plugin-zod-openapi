import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const run = () => {
  /**
   * a description
   */
  const ZodString = z.string().openapi({ description: 'a description' });

  return { ZodString };
};
