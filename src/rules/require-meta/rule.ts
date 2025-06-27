import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
} from '@typescript-eslint/utils';

import { findMetaCallExpression } from '../../util/traverse';
import { getInferredComment, getType } from '../../util/type';

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule: TSESLint.RuleModule<'meta-required', readonly unknown[]> =
  createRule({
    create(context) {
      return {
        VariableDeclaration(node) {
          const declarator = node?.declarations[0];
          if (!declarator) {
            return;
          }

          const type = getType(declarator, context);

          if (!type?.isZodType || type.name === 'ZodLiteral') {
            return;
          }

          const metaCallExpression = findMetaCallExpression(declarator);

          if (!metaCallExpression && !getInferredComment(declarator, context)) {
            return context.report({
              messageId: 'meta-required',
              node: declarator.id,
            });
          }
        },
        Property(node) {
          if (
            node.value.type === AST_NODE_TYPES.Identifier ||
            node.value.type === AST_NODE_TYPES.Literal ||
            (node.value.type === AST_NODE_TYPES.MemberExpression &&
              node.value.property.type === AST_NODE_TYPES.Identifier)
          ) {
            return;
          }

          const type = getType(node, context);

          if (!type?.isZodType || type.name === 'ZodLiteral') {
            return;
          }

          if (
            type.name.startsWith('ZodOptional') &&
            node.value.type === AST_NODE_TYPES.CallExpression &&
            node.value.callee.type === AST_NODE_TYPES.MemberExpression &&
            (node.value.callee.object.type === AST_NODE_TYPES.Identifier ||
              node.value.callee.object.type === AST_NODE_TYPES.MemberExpression)
          ) {
            return;
          }

          const metaCallExpression = findMetaCallExpression(node);

          if (!metaCallExpression) {
            return context.report({
              messageId: 'meta-required',
              node: node.key,
            });
          }
        },
        MemberExpression(node) {
          if (node.property.type !== AST_NODE_TYPES.Identifier) {
            return;
          }

          const parent = node.parent;

          if (parent?.type !== AST_NODE_TYPES.CallExpression) {
            return;
          }

          const argument = parent.arguments?.[1];

          if (!argument) {
            return;
          }

          const argumentType = getType(argument, context);

          if (!argumentType?.isZodType || argumentType.name === 'ZodLiteral') {
            return;
          }

          const metaCallExpression = findMetaCallExpression(argument);

          if (!metaCallExpression && !getInferredComment(argument, context)) {
            return context.report({
              messageId: 'meta-required',
              node: argument,
            });
          }
        },
      };
    },
    name: 'require-meta',
    meta: {
      type: 'suggestion',
      messages: {
        'meta-required': '.meta() is required on Zod Schema',
      },
      schema: [],
      docs: {
        description:
          'Requires that all zod schema have an meta method and select properties',
      },
    },
    defaultOptions: [],
  });
