import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
import { getInferredComment, getType } from '../../util/type';

const commentRegex = /\*\n\s+\* (.*)\n/;

const deprecatedTag = '@deprecated';

export const getCommentNode = (node: TSESTree.Node): TSESTree.Node => {
  if (node.parent?.type === 'ExportNamedDeclaration') {
    return node.parent;
  }

  return node;
};

export const getComment = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): TSESTree.BlockComment | undefined => {
  const comment = context.getSourceCode().getCommentsBefore(node).at(-1);
  return comment?.type === 'Block' ? comment : undefined;
};

const createCommentValue = (contents: string, deprecated: boolean) =>
  `${deprecated ? `${deprecatedTag} ` : ''}${contents}`;

const createFormattedComment = (
  contents: string,
  loc: TSESTree.SourceLocation,
  newline?: boolean,
) => {
  const indent = ' '.repeat(loc.start.column);
  return `${newline ? `\n${indent}` : ''}/**
${indent} * ${contents}
${indent} */
${indent}`;
};

export const isNewLineRequired = (node: TSESTree.Property) => {
  const objectExpression = node.parent;
  if (objectExpression?.type !== 'ObjectExpression') {
    return false;
  }

  // If our object property is on the same line as the starting object curly
  // we need a new line
  // eg. { description: 'a description' }
  if (node.loc.start.line === objectExpression.loc.start.line) {
    return true;
  }

  // if our object property is on the same line as another object key
  if (
    objectExpression.properties.some(
      (property) =>
        property.type === 'Property' &&
        node.range[0] !== property.range[0] &&
        node.range[1] !== property.range[1] &&
        node.loc.start.line === property.loc.start.line,
    )
  ) {
    return true;
  }

  return false;
};

interface PropertyNode {
  property: TSESTree.Property;
  value: TSESTree.Literal['value'];
}

const getPropertyNode = (
  properties: TSESTree.ObjectLiteralElement[],
  key: string,
): PropertyNode | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === key &&
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

const getExpectedCommentValue = (
  node: TSESTree.VariableDeclarator | TSESTree.Property,
  context: Readonly<TSESLint.RuleContext<any, any>>,
) => {
  const openApiCallExpression = findOpenApiCallExpression(node);
  if (!openApiCallExpression) {
    return getInferredComment(node, context);
  }

  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== 'ObjectExpression') {
    return;
  }

  const description = getPropertyNode(argument.properties, 'description');

  if (!description) {
    return context.report({
      messageId: 'required',
      node: openApiCallExpression,
    });
  }

  const descriptionValue = description.value;

  if (typeof descriptionValue !== 'string') {
    // would be handled by ts
    return;
  }

  if (!descriptionValue.length) {
    return context.report({
      messageId: 'required',
      node: description.property,
    });
  }

  const deprecated = getPropertyNode(argument.properties, 'deprecated');

  const deprecatedValue = Boolean(deprecated?.value);

  return createCommentValue(descriptionValue, deprecatedValue);
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

        const expectedCommentValue = getExpectedCommentValue(
          declarator,
          context,
        );

        if (!expectedCommentValue) {
          return;
        }

        const commentNode = getCommentNode(node);

        const comment = getComment(commentNode, context);

        if (!comment) {
          return context.report({
            messageId: 'comment',
            node: commentNode,
            fix: (fixer) =>
              fixer.insertTextBefore(
                commentNode,
                createFormattedComment(expectedCommentValue, commentNode.loc),
              ),
          });
        }

        const commentValue = commentRegex.exec(comment.value)?.[1];

        if (!commentValue || expectedCommentValue !== commentValue) {
          return context.report({
            messageId: 'comment',
            node: comment,
            fix: (fixer) => [
              fixer.removeRange([
                comment.range[0] - (comment.loc.start.column + 1), // indent
                comment.range[1],
              ]),
              fixer.insertTextBefore(
                commentNode,
                createFormattedComment(expectedCommentValue, commentNode.loc),
              ),
            ],
          });
        }
      },
      Property(node) {
        const type = getType(node, context);
        if (!type?.isZodType) {
          return;
        }

        const expectedCommentValue = getExpectedCommentValue(node, context);

        if (!expectedCommentValue) {
          return;
        }

        const commentNode = node;

        const comment = getComment(commentNode, context);

        if (!comment) {
          return context.report({
            messageId: 'comment',
            node: commentNode,
            fix: (fixer) =>
              fixer.insertTextBefore(
                commentNode,
                createFormattedComment(
                  expectedCommentValue,
                  commentNode.loc,
                  isNewLineRequired(node),
                ),
              ),
          });
        }

        const commentValue = commentRegex.exec(comment.value)?.[1];

        if (!commentValue || expectedCommentValue !== commentValue) {
          return context.report({
            messageId: 'comment',
            node: comment,
            fix: (fixer) => [
              fixer.removeRange([
                comment.range[0] - (commentNode.loc.start.column + 1), // newline
                comment.range[1],
              ]),
              fixer.insertTextBefore(
                commentNode,
                createFormattedComment(
                  expectedCommentValue,
                  commentNode.loc,
                  isNewLineRequired(node),
                ),
              ),
            ],
          });
        }
      },
    };
  },
  name: 'require-comment',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      required: '.openapi() description is required on Zod Schema',
      comment: '.openapi() description and deprecated must match comment',
    },
    schema: [],
    docs: {
      description:
        'Requires that all zod schema have a description and matching comment',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
