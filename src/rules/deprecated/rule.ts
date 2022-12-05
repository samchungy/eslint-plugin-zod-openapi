import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { createComment, getComment } from '../util/comments';
import { findOpenApiCallExpression } from '../util/traverse';
import { getType } from '../util/type';

interface Deprecated {
  property: TSESTree.Property;
  value: TSESTree.Literal['value'];
}

// With the following example it extracts 'some description'
// *
// * some description
const wordRegex = /[\*\\n ]+ (.*)/;

const deprecationTag = '@deprecated';

const getDeprecated = (
  properties: TSESTree.ObjectLiteralElement[],
): Deprecated | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'deprecated' &&
      property.value.type === 'Literal'
    ) {
      return {
        property,
        value: property.value.value,
      };
    }
  }
  return undefined;
};

const getExistingComment = (commentValue: string): string => {
  const regex = wordRegex.exec(commentValue);
  return regex?.[1] ?? '';
};

const testDeprecated = (
  node: TSESTree.VariableDeclaration | TSESTree.Property,
  context: Readonly<TSESLint.RuleContext<any, any>>,
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== 'ObjectExpression') {
    return;
  }

  const deprecated = getDeprecated(argument.properties);

  if (!deprecated) {
    return;
  }

  const deprecatedValue = deprecated.value;

  if (typeof deprecatedValue !== 'boolean' || !deprecatedValue) {
    return;
  }

  const commentNode = node.type === 'VariableDeclaration' ? node.parent : node;
  if (!commentNode) {
    return;
  }

  const comment = getComment(commentNode, context);

  if (!comment) {
    return context.report({
      messageId: 'comment',
      node: commentNode,
      fix: (fixer) =>
        fixer.insertTextBefore(
          commentNode,
          createComment(deprecationTag, commentNode.loc),
        ),
    });
  }

  const existingComment = getExistingComment(comment.value);

  if (!existingComment.includes(deprecationTag)) {
    return context.report({
      messageId: 'comment',
      node: comment,
      fix: (fixer) => [
        fixer.removeRange([
          comment.range[0] - (commentNode.loc.start.column + 1),
          comment.range[1],
        ]),
        fixer.insertTextBefore(
          commentNode,
          createComment(
            `${deprecationTag} ${existingComment}`,
            commentNode.loc,
          ),
        ),
      ],
    });
  }
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

        if (!type?.isZodType) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression) {
          return;
        }

        return testDeprecated(node, context, openApiCallExpression);
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

        return testDeprecated(node, context, openApiCallExpression);
      },
    };
  },
  name: 'open-api-deprecated',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      comment: '.openapi() deprecated should have a matching comment',
    },
    schema: [],
    docs: {
      description:
        'Requires that all zod schemas which are marked as deprecated have a matching comment',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
