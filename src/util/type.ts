import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
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
    prop.valueDeclaration!,
  );
  return checker.typeToString(propSymbol);
};

const getType = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<any, any>>,
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

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const nodeType = checker.getTypeAtLocation(originalNode);

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
    symbol.valueDeclaration!,
  );

  const type = checker.typeToString(constructorType);
  const name = symbol.getName();

  return {
    defType,
    unwrapType,
    name,
    type,
    isZodType: name.includes('Zod'),
    isZodPrimative: [
      'ZodString',
      'ZodNumber',
      'ZodBoolean',
      'ZodRecord',
      'ZodEnum',
    ].includes(unwrapType ?? name),
  };
};

const getInferredComment = <T extends TSESTree.Node>(
  node: T,
  context: Readonly<TSESLint.RuleContext<any, any>>,
): string | undefined => {
  const identifier = getIdentifier(node);
  if (!identifier) {
    return;
  }
  const baseIdentifier = getBaseIdentifier(identifier);
  if (!baseIdentifier) {
    return;
  }

  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(baseIdentifier);
  const symbol = checker.getSymbolAtLocation(originalNode);

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
  const tags = jsDoc.map((doc) => `@${doc.name} ${doc?.text?.[0].text ?? ''}`);
  return `${comment}${comment && tags.length ? '\n' : ''}${tags.join(' ')}`;
};

export { getType, getInferredComment };
