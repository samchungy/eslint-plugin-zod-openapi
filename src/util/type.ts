import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import ts from 'typescript';

import { getIdentifier } from './traverse';

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
  // 1. Grab the TypeScript program from parser services
  const parserServices = ESLintUtils.getParserServices(context);
  const checker = parserServices.program.getTypeChecker();

  // 2. Find the backing TS node for the ES node, then that TS type
  const originalNode = parserServices.esTreeNodeToTSNodeMap.get(identifier);
  const symbol = checker.getSymbolAtLocation(originalNode);

  if (symbol) {
    const comment = ts.displayPartsToString(
      symbol.getDocumentationComment(checker),
    );
    if (!comment) {
      const jsDoc = symbol.getJsDocTags(checker);
      const deprecated = jsDoc.find((doc) => doc.name === 'deprecated');
      const tags = jsDoc.map(
        (doc) => `@${doc.name} ${deprecated?.text?.[0].text ?? ''}`,
      );
      return tags.join(' ');
    }
    return comment;
  }
  return;
};

export { getType, getInferredComment };
