import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
} from '@typescript-eslint/utils';

import { findOpenApiCallExpression, getIdentifier } from '../../util/traverse';
import { getType } from '../../util/type';

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule: TSESLint.RuleModule<'requires', readonly unknown[]> =
  createRule({
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

          if (!openApiCallExpression) {
            return;
          }

          const lastNode = getIdentifier(declarator);

          if (!lastNode || lastNode?.name === 'openapi') {
            return;
          }

          if (
            lastNode.parent?.type === AST_NODE_TYPES.MemberExpression &&
            lastNode.parent.parent?.type === AST_NODE_TYPES.CallExpression
          ) {
            return context.report({
              messageId: 'requires',
              node:
                openApiCallExpression.callee.type ===
                AST_NODE_TYPES.MemberExpression
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

          if (!openApiCallExpression) {
            return;
          }

          const lastNode = getIdentifier(node.value);

          if (!lastNode || lastNode?.name === 'openapi') {
            return;
          }

          if (
            lastNode.parent?.type === AST_NODE_TYPES.MemberExpression &&
            lastNode.parent.parent?.type === AST_NODE_TYPES.CallExpression
          ) {
            return context.report({
              messageId: 'requires',
              node:
                openApiCallExpression.callee.type ===
                AST_NODE_TYPES.MemberExpression
                  ? openApiCallExpression.callee.property
                  : openApiCallExpression,
            });
          }
        },
      };
    },
    name: 'require-openapi-last',
    meta: {
      type: 'suggestion',
      messages: {
        requires: '.openapi() should be declared at the end of a zod chain',
      },
      schema: [],
      docs: {
        description:
          'Requires that .openapi() should be declared at the end of a zod chain',
      },
    },
    defaultOptions: [],
  });
