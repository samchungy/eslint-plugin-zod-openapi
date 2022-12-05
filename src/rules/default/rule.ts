import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../util/traverse';
import { getType } from '../util/type';

const isZodPrimative = (type: string): boolean =>
  ['ZodString', 'ZodNumber', 'ZodEnum', 'ZodBoolean', 'ZodRecord'].includes(
    type,
  );

const getDefault = (
  properties: TSESTree.ObjectLiteralElement[],
): TSESTree.Property | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'default'
    ) {
      return property;
    }
  }
  return undefined;
};

const testDefault = (
  _node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== 'ObjectExpression') {
    return;
  }

  const def = getDefault(argument.properties);

  if (!def) {
    return;
  }

  return context.report({
    messageId: 'prefer',
    node: def,
  });
};

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
        if (
          !type?.isZodType ||
          !type.escapedName ||
          !isZodPrimative(type.escapedName)
        ) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression) {
          return;
        }

        return testDefault(node, context, openApiCallExpression);
      },
      Property(node) {
        const type = getType(node, context);
        if (
          !type?.isZodType ||
          !type.escapedName ||
          !isZodPrimative(type.escapedName)
        ) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression) {
          return;
        }

        return testDefault(node, context, openApiCallExpression);
      },
    };
  },
  name: 'open-api-example',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      prefer: 'use .default() instead of .openapi() default',
    },
    schema: [],
    docs: {
      description: 'Requires that all zod primatives have an example',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
