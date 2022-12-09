import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

import { getBaseIdentifier, getIdentifier } from './traverse';

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

  if (symbol) {
    const aliasedSymbol =
      symbol.flags === ts.SymbolFlags.AliasExcludes
        ? checker.getAliasedSymbol(symbol)
        : symbol;
    const comment = ts.displayPartsToString(
      aliasedSymbol.getDocumentationComment(checker),
    );
    if (!comment) {
      const jsDoc = aliasedSymbol.getJsDocTags(checker);
      const tags = jsDoc.map(
        (doc) => `@${doc.name} ${doc?.text?.[0].text ?? ''}`,
      );
      return tags.join(' ');
    }
    return comment;
  }
  return;
};

export { getType, getInferredComment };
