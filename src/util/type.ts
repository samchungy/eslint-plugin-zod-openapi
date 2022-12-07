import { TSESTreeToTSNode } from '@typescript-eslint/typescript-estree';
import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

const getType = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<any, any>>,
):
  | {
      originalNode: TSESTreeToTSNode<T>;
      nodeType: ts.Type;
      escapedName: string | undefined;
      isZodType: boolean;
    }
  | undefined => {
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const nodeType = checker.getTypeAtLocation(originalNode);
  const escapedName = nodeType.symbol?.escapedName?.toString();

  // for (const sourceFile of parserServices.program.getSourceFiles()) {
  //   if (!sourceFile.isDeclarationFile) {
  //     ts.forEachChild(sourceFile, visit);
  //   }
  // }

  // function visit(node1: ts.Node) {
  //   const count = node1.getChildCount();

  //   if (count > 0) {
  //     ts.forEachChild(node1, visit);
  //   }

  //   const symbol = checker.getSymbolAtLocation(node1.name);
  //   if (symbol) {
  //     const a = serializeSymbol(symbol);
  //     console.log(a);
  //   }
  // }

  // function serializeSymbol(symbol: ts.Symbol) {
  //   return {
  // name: symbol.getName(),
  // comment: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
  // type: checker.typeToString(
  //   checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
  // ),
  //   };
  // }
  return {
    originalNode,
    nodeType,
    escapedName,
    isZodType: Boolean(escapedName?.includes('Zod')),
  };
};
export { getType };
