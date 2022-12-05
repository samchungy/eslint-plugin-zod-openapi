import { ESLintUtils } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../util/traverse';
import { getType } from '../util/type';

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule = createRule({
  create(context) {
    return {
      VariableDeclaration(node) {
        const declarator = node?.declarations[0];
        if (!declarator) {
          return;
        }

        if (declarator.init?.type === 'Identifier') {
          return;
        }

        const type = getType(declarator, context);

        if (!type?.isZodType) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression) {
          return context.report({
            messageId: 'open-api-required',
            node: declarator,
          });
        }
      },
      Property(node) {
        const type = getType(node, context);
        if (!type?.isZodType) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression && node.value.type !== 'Identifier') {
          return context.report({
            messageId: 'open-api-required',
            node,
          });
        }
      },
    };
  },
  name: 'open-api-required',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      'open-api-required': '.openapi() is required on Zod Schema',
    },
    schema: [],
    docs: {
      description:
        'Requires that all zod schema have an openapi method and select properties',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
