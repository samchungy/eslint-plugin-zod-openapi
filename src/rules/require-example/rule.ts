import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
import { getType } from '../../util/type';

type Key = 'example' | 'examples';

const getExample = (
  properties: TSESTree.ObjectLiteralElement[],
  key?: string,
): TSESTree.Property | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
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
  context: Readonly<TSESLint.RuleContext<'required', [Key]>>,
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== 'ObjectExpression') {
    return;
  }

  const example = getExample(argument.properties, context.options[0]);

  if (!example) {
    return context.report({
      messageId: 'required',
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

export const rule = createRule<[Key], 'required'>({
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
      required: '.openapi() example is required for Zod primatives',
    },
    schema: [
      {
        enum: ['example', 'examples'],
      },
    ],
    docs: {
      description: 'Requires that all zod primatives have an example',
      recommended: 'error',
    },
  },
  defaultOptions: ['example'],
});
