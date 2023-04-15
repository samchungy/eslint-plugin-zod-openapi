import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const StringDateSchema = z
  .string()
  .regex(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/); // Matches ISOString UTC with or without ms dates eg. 2011-10-05T14:48:00.000Z or 2011-10-05T14:48:00Z
/**
 * hello
 */
export const OtherSchema = z.string().openapi({ description: 'hello' });
