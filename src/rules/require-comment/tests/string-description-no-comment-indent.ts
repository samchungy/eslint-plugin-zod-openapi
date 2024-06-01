import 'zod-openapi/extend';
import { z } from 'zod';

export const run = () => {
  const ZodString = z.string().openapi({ description: 'a description' });

  return { ZodString };
};
