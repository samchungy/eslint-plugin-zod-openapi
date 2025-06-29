import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';

import { findMetaCallExpression } from '../../util/traverse';
import { getType } from '../../util/type';

type Key = 'example' | 'examples';
type MessageIds = 'require-example' | 'require-examples';

const getExample = (
  properties: TSESTree.ObjectLiteralElement[],
  key?: string,
): TSESTree.Property | undefined => {
  for (const property of properties) {
    if (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      ((key === 'examples' && property.key.name === 'examples') ||
        ((!key || key === 'example') && property.key.name === 'example'))
    ) {
      return property;
    }
  }
  return undefined;
};

const testExample = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<MessageIds, [Key]>>,
  metaCallExpression: TSESTree.CallExpression,
) => {
  const argument = metaCallExpression?.arguments[0];
  if (!argument || argument.type !== AST_NODE_TYPES.ObjectExpression) {
    return;
  }

  const example = getExample(argument.properties, context.options[0]);

  if (!example) {
    return context.report({
      messageId:
        context.options[0] === 'examples'
          ? 'require-examples'
          : 'require-example',
      node: metaCallExpression,
    });
  }

  const parent = node.parent;
  if (!parent) {
    return;
  }
};

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule = createRule<[Key], MessageIds>({
  create(context) {
    return {
      VariableDeclaration(node) {
        const declarator = node?.declarations[0];
        if (!declarator) {
          return;
        }

        if (declarator.init?.type === AST_NODE_TYPES.Identifier) {
          return;
        }

        const type = getType(declarator, context);
        if (!type?.isZodType || !type.isZodPrimitive) {
          return;
        }

        const metaCallExpression = findMetaCallExpression(declarator);

        if (!metaCallExpression) {
          return;
        }

        return testExample(node, context, metaCallExpression);
      },
      Property(node) {
        const type = getType(node, context);
        if (!type?.isZodType || !type.isZodPrimitive) {
          return;
        }

        const metaCallExpression = findMetaCallExpression(node);

        if (!metaCallExpression) {
          return;
        }

        return testExample(node, context, metaCallExpression);
      },
    };
  },
  name: 'require-example',
  meta: {
    type: 'suggestion',
    messages: {
      'require-example': '.meta() example is required for Zod primatives',
      'require-examples': '.meta() examples is required for Zod primatives',
    },
    schema: [
      {
        type: 'string',
        enum: ['example', 'examples'],
      },
    ],
    docs: {
      description: 'Requires that all zod primatives have an example',
    },
  },
  defaultOptions: ['example'],
});
