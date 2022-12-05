import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const getComment = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): TSESTree.Comment | undefined =>
  context.getSourceCode().getCommentsBefore(node)[0];

export const createComment = (
  contents: string,
  loc: TSESTree.SourceLocation,
) => {
  const indent = ' '.repeat(loc.start.column);
  return `/**
${indent} * ${contents}
${indent} */
${indent}`;
};
