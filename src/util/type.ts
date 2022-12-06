import { TSESTreeToTSNode } from '@typescript-eslint/typescript-estree';
import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

interface TsType {
  originalNode: TSESTreeToTSNode<
    TSESTree.Property | TSESTree.VariableDeclarator
  >;
  nodeType: ts.Type;
  escapedName: string | undefined;
  isZodType: boolean;
}

const getType = (
  node: TSESTree.VariableDeclarator | TSESTree.Property,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): TsType | undefined => {
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const nodeType = checker.getTypeAtLocation(originalNode);
  const escapedName = nodeType.symbol?.escapedName?.toString();

  return {
    originalNode,
    nodeType,
    escapedName,
    isZodType: Boolean(escapedName?.includes('Zod')),
  };
};

export { getType };
