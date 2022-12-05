import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const run = () => {
  /**
   * correct description
   */
  const ZodString = z.string().openapi({ description: 'correct description' });

  return { ZodString };
};
