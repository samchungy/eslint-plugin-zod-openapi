import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
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
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
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
      node: openApiCallExpression,
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
        if (!type?.isZodType || !type.isZodPrimative) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression) {
          return;
        }

        return testExample(node, context, openApiCallExpression);
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

        return testExample(node, context, openApiCallExpression);
      },
    };
  },
  name: 'require-example',
  meta: {
    type: 'suggestion',
    messages: {
      'require-example': '.openapi() example is required for Zod primatives',
      'require-examples': '.openapi() examples is required for Zod primatives',
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
