import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const getComment = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): TSESTree.Comment | undefined =>
  context.getSourceCode().getCommentsBefore(node)[0];

export const createComment = (contents: string) => `/**
 * ${contents}
 */
`;
