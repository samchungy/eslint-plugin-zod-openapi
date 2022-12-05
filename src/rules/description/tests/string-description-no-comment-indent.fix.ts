import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const run = () => {
  /**
   * a description
   */
  const ZodString = z.string().openapi({ description: 'a description' });

  return { ZodString };
};
