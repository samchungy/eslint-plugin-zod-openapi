import { z } from 'zod';
import { ZodOpenApiOperationObject, extendZodWithOpenApi } from 'zod-openapi';
extendZodWithOpenApi(z);

const QuerySchema = z
  .object({
    a: z.string().openapi({ description: 'a', example: 'a' }),
  })
  .openapi({ description: 'Query schema' });

const GetJobResponseSchema = z
  .object({
    a: z.string().openapi({ description: 'a', example: 'a' }),
  })
  .openapi({ description: 'Response schema' });

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
