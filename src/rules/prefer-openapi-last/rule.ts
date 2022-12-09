import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression, getIdentifier } from '../../util/traverse';
import { getType } from '../../util/type';

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

const isInRegister = (callExpression: TSESTree.CallExpression) =>
  callExpression.parent?.type === 'CallExpression' &&
  callExpression.parent.callee.type === 'MemberExpression' &&
  callExpression.parent.callee.property.type === 'Identifier' &&
  callExpression.parent.callee.property.name === 'register';

export const rule = createRule({
  create(context) {
    return {
      VariableDeclaration(node) {
        const declarator = node?.declarations[0];
        if (!declarator) {
          return;
        }

        const type = getType(declarator, context);
        if (!type?.isZodType) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression || isInRegister(openApiCallExpression)) {
          return;
        }

        const lastNode = getIdentifier(declarator);

        if (!lastNode || lastNode?.name === 'openapi') {
          return;
        }

        if (
          lastNode.parent?.type === 'MemberExpression' &&
          lastNode.parent.parent?.type === 'CallExpression'
        ) {
          return context.report({
            messageId: 'requires',
            node:
              openApiCallExpression.callee.type === 'MemberExpression'
                ? openApiCallExpression.callee.property
                : openApiCallExpression,
          });
        }
      },
      Property(node) {
        const type = getType(node, context);
        if (!type?.isZodType) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression || isInRegister(openApiCallExpression)) {
          return;
        }

        const lastNode = getIdentifier(node.value);

        if (!lastNode || lastNode?.name === 'openapi') {
          return;
        }

        if (
          lastNode.parent?.type === 'MemberExpression' &&
          lastNode.parent.parent?.type === 'CallExpression'
        ) {
          return context.report({
            messageId: 'requires',
            node:
              openApiCallExpression.callee.type === 'MemberExpression'
                ? openApiCallExpression.callee.property
                : openApiCallExpression,
          });
        }
      },
    };
  },
  name: 'require-openapi-last',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      requires: '.openapi() should be declared at the end of a zod chain',
    },
    schema: [],
    docs: {
      description:
        'Requires that .openapi() should be declared at the end of a zod chain',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
