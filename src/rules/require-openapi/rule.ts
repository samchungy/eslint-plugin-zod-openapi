import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
import { getInferredComment, getType } from '../../util/type';

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule: TSESLint.RuleModule<any, any> = createRule({
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

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (
          !openApiCallExpression &&
          !getInferredComment(declarator, context)
        ) {
          return context.report({
            messageId: 'open-api-required',
            node: declarator.id,
          });
        }
      },
      Property(node) {
        if (
          node.value.type === 'Identifier' ||
          node.value.type === 'Literal' ||
          (node.value.type === 'MemberExpression' &&
            node.value.property.type === 'Identifier')
        ) {
          return;
        }

        const type = getType(node, context);

        if (!type?.isZodType || type.name === 'ZodLiteral') {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression) {
          return context.report({
            messageId: 'open-api-required',
            node: node.key,
          });
        }
      },
      MemberExpression(node) {
        if (node.property.type !== 'Identifier') {
          return;
        }

        const parent = node.parent;

        if (parent?.type !== 'CallExpression') {
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

        const openApiCallExpression = findOpenApiCallExpression(argument);

        if (!openApiCallExpression && !getInferredComment(argument, context)) {
          return context.report({
            messageId: 'open-api-required',
            node: argument,
          });
        }
      },
    };
  },
  name: 'require-openapi',
  meta: {
    type: 'suggestion',
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
