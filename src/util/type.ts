import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

const getType = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<any, any>>,
):
  | {
      type: string;
      isZodType: boolean;
      isZodPrimative: boolean;
    }
  | undefined => {
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const nodeType = checker.getTypeAtLocation(originalNode);
  if (!nodeType.symbol) {
    return;
  }
  const type = nodeType.symbol.escapedName.toString();

  return {
    type,
    isZodType: type.includes('Zod'),
    isZodPrimative: [
      'ZodString',
      'ZodNumber',
      'ZodEnum',
      'ZodBoolean',
      'ZodRecord',
    ].includes(type),
  };
};

const getIdentifier = <T extends TSESTree.Node>(
  node: T,
): TSESTree.Identifier | undefined => {
  if (node.type === 'Identifier') {
    return node;
  }

  if (node.type === 'VariableDeclarator') {
    if (!node.init) {
      return;
    }
    return getIdentifier(node.init);
  }

  if (node.type === 'Property') {
    return getIdentifier(node.value);
  }

  if (node.type === 'MemberExpression') {
    return getIdentifier(node.property);
  }

  return;
};

const getInferredComment = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): string | undefined => {
  const identifier = getIdentifier(node);
  if (!identifier) {
    return;
  }
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(identifier);
  const symbol = checker.getSymbolAtLocation(originalNode);

  if (symbol) {
    return ts.displayPartsToString(symbol.getDocumentationComment(checker));
  }
  return;
};

export { getType, getInferredComment };
