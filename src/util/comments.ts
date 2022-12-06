import { TSESLint, TSESTree } from '@typescript-eslint/utils';

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
${indent} * ${deprecated ? '@deprecated ' : ''}${contents}
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
