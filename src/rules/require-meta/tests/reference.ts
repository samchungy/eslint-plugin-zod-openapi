import { z } from 'zod/v4';
import type { ZodOpenApiOperationObject } from 'zod-openapi';

const QuerySchema = z
  .object({
    a: z.string().meta({ description: 'a', example: 'a' }),
  })
  .meta({ description: 'Query schema' });

const GetJobResponseSchema = z
  .object({
    a: z.string().meta({ description: 'a', example: 'a' }),
  })
  .meta({ description: 'Response schema' });

export const getJobOperation: ZodOpenApiOperationObject = {
  operationId: 'getJob',
  summary: 'Get Job',
  requestParams: {
    query: QuerySchema,
  },
  responses: {
    '200': {
      description: 'Successful operation',
      content: {
        'application/json': {
          schema: GetJobResponseSchema,
        },
      },
    },
  },
};
