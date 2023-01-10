import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../../util/traverse';
import { getInferredComment, getType } from '../../util/type';

const commentRegex = /[\*\n\s]+(.*)[\*\s]+(.*)/;

const DEPRECATED_TAG = '@deprecated';
const EXAMPLE_TAG = '@example';

const getCommentValue = (comment: string): string | undefined => {
  const match = commentRegex.exec(comment);

  const commentValue = match?.[1];
  const exampleValue = match?.[2];

  return commentValue
    ? `${commentValue}${exampleValue ? `\n${exampleValue}` : ''}`
    : undefined;
};

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

const createCommentValue = (
  contents: string,
  deprecated: boolean,
  example?: TSESTree.Literal['value'],
) => {
  const deprecatedValue = deprecated ? `${DEPRECATED_TAG} ` : '';
  const exampleValue = example
    ? `\n${EXAMPLE_TAG} ${JSON.stringify(example)}`
    : '';
  return `${deprecatedValue}${contents}${exampleValue}`;
};

const createFormattedComment = (
  contents: string,
  loc: TSESTree.SourceLocation,
  newline?: boolean,
) => {
  const lines = contents.split('\n');

  const indent = ' '.repeat(loc.start.column);

  return `${newline ? `\n${indent}` : ''}/**
${lines.map((line) => `${indent} * ${line}`).join('\n')}
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

const getPropertyNode = (
  properties: TSESTree.ObjectLiteralElement[],
  key: string,
):
  | TSESTree.PropertyComputedName
  | TSESTree.PropertyNonComputedName
  | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === key
    ) {
      return property;
    }
  }
  return undefined;
};

const getExampleValue = (
  properties: TSESTree.ObjectLiteralElement[],
): TSESTree.Literal['value'] | undefined => {
  const examples = getPropertyNode(properties, 'examples');
  const example = getPropertyNode(properties, 'example');

  if (examples) {
    if (examples.value.type !== 'ArrayExpression') {
      // This should always be an array if not ts compiler will complain
      return;
    }

    const element = examples.value.elements?.[0];

    if (!element || element.type !== 'Literal') {
      return;
    }

    // Because grabbing a value is difficult if it is not a literal
    return element.value;
  }

  if (example) {
    if (example.value.type !== 'Literal') {
      return;
    }

    return example.value.value;
  }

  return undefined;
};

const getLiteralValue = (
  property:
    | TSESTree.PropertyComputedName
    | TSESTree.PropertyNonComputedName
    | undefined,
): TSESTree.Literal['value'] | undefined => {
  if (!property) {
    return undefined;
  }

  if (property.value.type === 'Literal') {
    return property.value.value;
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

  const descriptionProperty = getPropertyNode(
    argument.properties,
    'description',
  );

  if (!descriptionProperty) {
    return context.report({
      messageId: 'required',
      node: openApiCallExpression,
    });
  }

  const descriptionValue = getLiteralValue(descriptionProperty);

  if (typeof descriptionValue !== 'string') {
    // would be handled by ts
    return;
  }

  if (!descriptionValue.length) {
    return context.report({
      messageId: 'required',
      node: descriptionProperty,
    });
  }

  const deprecatedNode = getPropertyNode(argument.properties, 'deprecated');
  const deprecatedValue = Boolean(getLiteralValue(deprecatedNode));

  const exampleValue = getExampleValue(argument.properties);

  return createCommentValue(descriptionValue, deprecatedValue, exampleValue);
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

        const commentValue = getCommentValue(comment.value);

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

        const commentValue = getCommentValue(comment.value);

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
      TSTypeReference(node) {
        // only check z.infer, z.input, z.output
        if (
          node.typeName.type !== 'TSQualifiedName' ||
          node.typeName.left.type !== 'Identifier' ||
          node.typeName.left.name !== 'z' ||
          node.typeName.right.type !== 'Identifier' ||
          (node.typeName.right.name !== 'infer' &&
            node.typeName.right.name !== 'input' &&
            node.typeName.right.name !== 'output')
        ) {
          return;
        }

        if (node.typeParameters?.type !== 'TSTypeParameterInstantiation') {
          return;
        }

        const param = node.typeParameters.params[0];

        if (
          param?.type !== 'TSTypeQuery' ||
          param.exprName.type !== 'Identifier'
        ) {
          return;
        }

        const declaration = node.parent;

        if (declaration?.type !== 'TSTypeAliasDeclaration') {
          return;
        }

        const expectedCommentValue = getInferredComment(
          param.exprName,
          context,
        );

        if (!expectedCommentValue) {
          return;
        }

        const commentNode = getCommentNode(declaration);
        const comment = getComment(commentNode, context);

        if (!comment) {
          return context.report({
            messageId: 'comment',
            node: declaration.id,
            fix: (fixer) =>
              fixer.insertTextBefore(
                commentNode,
                createFormattedComment(expectedCommentValue, commentNode.loc),
              ),
          });
        }

        const commentValue = getCommentValue(comment.value);

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
    };
  },
  name: 'require-comment',
  meta: {
    fixable: 'code',
    type: 'suggestion',
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
