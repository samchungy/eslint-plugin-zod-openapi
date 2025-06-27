import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
} from '@typescript-eslint/utils';

import { findMetaCallExpression, getIdentifier } from '../../util/traverse';
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

          const metaCallExpression = findMetaCallExpression(declarator);

          if (!metaCallExpression) {
            return;
          }

          const lastNode = getIdentifier(declarator);

          if (!lastNode || lastNode?.name === 'meta') {
            return;
          }

          if (
            lastNode.parent?.type === AST_NODE_TYPES.MemberExpression &&
            lastNode.parent.parent?.type === AST_NODE_TYPES.CallExpression
          ) {
            return context.report({
              messageId: 'requires',
              node:
                metaCallExpression.callee.type ===
                AST_NODE_TYPES.MemberExpression
                  ? metaCallExpression.callee.property
                  : metaCallExpression,
            });
          }
        },
        Property(node) {
          const type = getType(node, context);
          if (!type?.isZodType) {
            return;
          }

          const metaCallExpression = findMetaCallExpression(node);

          if (!metaCallExpression) {
            return;
          }

          const lastNode = getIdentifier(node.value);

          if (!lastNode || lastNode?.name === 'meta') {
            return;
          }

          if (
            lastNode.parent?.type === AST_NODE_TYPES.MemberExpression &&
            lastNode.parent.parent?.type === AST_NODE_TYPES.CallExpression
          ) {
            return context.report({
              messageId: 'requires',
              node:
                metaCallExpression.callee.type ===
                AST_NODE_TYPES.MemberExpression
                  ? metaCallExpression.callee.property
                  : metaCallExpression,
            });
          }
        },
      };
    },
    name: 'require-meta-last',
    meta: {
      type: 'suggestion',
      messages: {
        requires: '.meta() should be declared at the end of a zod chain',
      },
      schema: [],
      docs: {
        description:
          'Requires that .meta() should be declared at the end of a zod chain',
      },
    },
    defaultOptions: [],
  });
