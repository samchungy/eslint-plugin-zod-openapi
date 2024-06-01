import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESLint,
  type TSESTree,
} from '@typescript-eslint/utils';
import ts from 'typescript';

import { getBaseIdentifier, getIdentifier } from './traverse';

const getPropType = (
  checker: ts.TypeChecker,
  nodeType: ts.Type,
  property: string,
) => {
  const prop = nodeType.getProperty(property);
  if (!prop) {
    return;
  }
  const propSymbol = checker.getTypeOfSymbolAtLocation(
    prop,
    prop.valueDeclaration as ts.Declaration,
  );
  return checker.typeToString(propSymbol);
};

const getType = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
):
  | {
      defType: string | undefined;
      unwrapType: string | undefined;
      name: string;
      type: string;
      isZodType: boolean;
      isZodPrimative: boolean;
    }
  | undefined => {
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();
  const nodeType = parserServices.getTypeAtLocation(node);

  const symbol = nodeType.getSymbol();
  if (!symbol) {
    return;
  }

  const defType = getPropType(checker, nodeType, '_def');

  const maybeUnwrapType = getPropType(checker, nodeType, 'unwrap');
  const unwrapType = maybeUnwrapType?.startsWith('() => ')
    ? maybeUnwrapType.slice(6)
    : undefined;

  const constructorType = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration as ts.Declaration,
  );

  const type = checker.typeToString(constructorType);
  const name = symbol.getName();

  return {
    defType,
    unwrapType,
    name,
    type,
    isZodType: name.includes('Zod') && !name.includes('ZodOpenApi'),
    isZodPrimative: [
      'ZodString',
      'ZodNumber',
      'ZodBoolean',
      'ZodRecord',
      'ZodEnum',
    ].includes(unwrapType ?? name),
  };
};

const getFlowNode = (
  node: ts.Node,
  baseIdentifier: TSESTree.Node,
): ts.Node & { name?: ts.Node } => {
  if (
    !('flowNode' in node) ||
    !node.flowNode ||
    baseIdentifier.type !== AST_NODE_TYPES.Identifier ||
    baseIdentifier.parent?.type !== AST_NODE_TYPES.Property ||
    baseIdentifier.parent.key?.type !== AST_NODE_TYPES.Identifier ||
    baseIdentifier.name !== baseIdentifier.parent.key.name
  ) {
    return node;
  }

  const flowNode = node.flowNode;
  if (typeof flowNode !== 'object' || !('node' in flowNode) || !flowNode.node) {
    return node;
  }

  return flowNode.node as ts.Node & { name: ts.Node };
};

const getInferredComment = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
): string | undefined => {
  const identifier = getIdentifier(node);
  if (!identifier) {
    return;
  }
  const baseIdentifier = getBaseIdentifier(identifier);
  if (!baseIdentifier) {
    return;
  }

  if (
    baseIdentifier.parent?.type === AST_NODE_TYPES.Property &&
    baseIdentifier.parent.parent?.type === AST_NODE_TYPES.ObjectExpression &&
    baseIdentifier.parent.parent.parent?.type !== AST_NODE_TYPES.CallExpression
  ) {
    return;
  }

  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(baseIdentifier);
  const flowNode = getFlowNode(originalNode, baseIdentifier);
  const symbol = checker.getSymbolAtLocation(flowNode?.name ?? flowNode);

  if (!symbol) {
    return;
  }

  const aliasedSymbol =
    symbol.flags === ts.SymbolFlags.AliasExcludes
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const comment = ts.displayPartsToString(
    aliasedSymbol.getDocumentationComment(checker),
  );
  const jsDoc = aliasedSymbol.getJsDocTags(checker);
  const tags = jsDoc.map((doc) => `@${doc.name} ${doc?.text?.[0]?.text ?? ''}`);
  return `${comment}${comment && tags.length ? '\n' : ''}${tags.join(' ')}`;
};

export { getType, getInferredComment };
