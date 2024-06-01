import 'zod-openapi/extend';
import { z } from 'zod';

export const ZodString = z
  .string()
  .openapi({ deprecated: true, description: 'a description' });
