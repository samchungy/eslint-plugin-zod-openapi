import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression, getCommentNode } from '../util/traverse';
import { getType } from '../util/type';

const deprecatedTag = '@deprecated';

export const getComment = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): TSESTree.Comment | undefined =>
  context.getSourceCode().getCommentsBefore(node)[0];

interface CommentParams {
  contents: string;
  loc: TSESTree.SourceLocation;
  deprecated: boolean;
  newline?: boolean;
}

export const createComment = ({
  contents,
  loc,
  deprecated,
  newline,
}: CommentParams) => {
  const indent = ' '.repeat(loc.start.column);
  return `${newline ? `\n${indent}` : ''}/**
${indent} * ${deprecated ? `${deprecatedTag} ` : ''}${contents}
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

        const commentNode = getCommentNode(node);

        const comment = getComment(commentNode, context);

        if (!comment) {
          return context.report({
            messageId: 'comment',
            node: commentNode,
            fix: (fixer) =>
              fixer.insertTextBefore(
                commentNode,
                createComment({
                  contents: descriptionValue,
                  loc: commentNode.loc,
                  deprecated: deprecatedValue,
                }),
              ),
          });
        }

        if (
          !comment.value.includes(descriptionValue) || deprecatedValue
            ? !comment.value.includes(deprecatedTag)
            : false
        ) {
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
                createComment({
                  contents: descriptionValue,
                  loc: commentNode.loc,
                  deprecated: deprecatedValue,
                }),
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

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression) {
          return;
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
          return;
        }

        if (!descriptionValue.length) {
          return context.report({
            messageId: 'required',
            node: description.property,
          });
        }

        const commentNode = node;

        const comment = getComment(commentNode, context);

        const deprecated = getPropertyNode(argument.properties, 'deprecated');

        const deprecatedValue = Boolean(deprecated?.value);

        if (!comment) {
          return context.report({
            messageId: 'comment',
            node: commentNode,
            fix: (fixer) =>
              fixer.insertTextBefore(
                commentNode,
                createComment({
                  contents: descriptionValue,
                  loc: commentNode.loc,
                  deprecated: deprecatedValue,
                  newline: isNewLineRequired(node),
                }),
              ),
          });
        }

        if (
          !comment.value.includes(descriptionValue) || deprecatedValue
            ? !comment.value.includes(deprecatedTag)
            : false
        ) {
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
                createComment({
                  contents: descriptionValue,
                  loc: commentNode.loc,
                  deprecated: deprecatedValue,
                }),
              ),
            ],
          });
        }
      },
    };
  },
  name: 'open-api-comment',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      required: '.openapi() description is required on Zod Schema',
      comment: '.openapi() description must match comment',
      deprecated: '.openapi() description must contain deprecated tag',
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
