import { TSESLint, TSESTree } from '@typescript-eslint/utils';

export const getComment = (
  node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
) => context.getSourceCode().getCommentsBefore(node);
