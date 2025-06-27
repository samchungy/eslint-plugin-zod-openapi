import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';

import { findMetaCallExpression } from '../../util/traverse';
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
  metaCallExpression: TSESTree.CallExpression,
) => {
  const argument = metaCallExpression?.arguments[0];
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

        const metaCallExpression = findMetaCallExpression(declarator);

        if (!metaCallExpression) {
          return;
        }

        return testDefault(node, context, metaCallExpression);
      },
      Property(node) {
        const type = getType(node, context);
        if (!type?.isZodType || !type.isZodPrimative) {
          return;
        }

        const metaCallExpression = findMetaCallExpression(node);

        if (!metaCallExpression) {
          return;
        }

        return testDefault(node, context, metaCallExpression);
      },
    };
  },
  name: 'prefer-zod-default',
  meta: {
    type: 'suggestion',
    messages: {
      prefer: 'use .default() instead of .meta() default',
    },
    schema: [],
    docs: {
      description: 'Requires that all zod primatives have an example',
    },
  },
  defaultOptions: [],
});
