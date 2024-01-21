import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
import { getType } from '../../util/type';

const getDefault = (
  properties: TSESTree.ObjectLiteralElement[],
): TSESTree.Property | undefined => {
  for (const property of properties) {
    if (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === 'default'
    ) {
      return property;
    }
  }
  return undefined;
};

const testDefault = (
  _node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<'prefer', readonly unknown[]>>,
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== AST_NODE_TYPES.ObjectExpression) {
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

        const type = getType(declarator, context);
        if (!type?.isZodType) {
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
        if (!type?.isZodType || !type.isZodPrimative) {
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
  name: 'prefer-zod-default',
  meta: {
    type: 'suggestion',
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
