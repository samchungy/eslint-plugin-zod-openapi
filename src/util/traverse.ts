import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

const findOpenApiInChain = (
  root: TSESTree.CallExpression,
): TSESTree.CallExpression | undefined => {
  const callee = root.callee;
  if (callee.type !== AST_NODE_TYPES.MemberExpression) {
    return;
  }

  const property = callee.property;
  if (property.type === AST_NODE_TYPES.Identifier) {
    if (property.name === 'openapi') {
      return root;
    }
  }

  if (callee.object.type === AST_NODE_TYPES.CallExpression) {
    return findOpenApiInChain(callee.object);
  }

  return undefined;
};

export const findOpenApiCallExpression = (
  node:
    | TSESTree.VariableDeclarator
    | TSESTree.Property
    | TSESTree.CallExpressionArgument,
): TSESTree.CallExpression | undefined => {
  if (node.type === AST_NODE_TYPES.VariableDeclarator) {
    const init = node.init;
    if (!init || init.type !== AST_NODE_TYPES.CallExpression) {
      return;
    }

    return findOpenApiInChain(init);
  }

  if (node.type === AST_NODE_TYPES.Property) {
    const value = node.value;
    if (!value || value.type !== AST_NODE_TYPES.CallExpression) {
      return;
    }

    return findOpenApiInChain(value);
  }

  if (node.type === AST_NODE_TYPES.CallExpression) {
    return findOpenApiInChain(node);
  }

  return undefined;
};

export const getIdentifier = <T extends TSESTree.Node>(
  node: T,
): TSESTree.Identifier | undefined => {
  if (node.type === AST_NODE_TYPES.Identifier) {
    return node;
  }

  if (node.type === AST_NODE_TYPES.VariableDeclarator) {
    if (!node.init) {
      return;
    }
    return getIdentifier(node.init);
  }

  if (node.type === AST_NODE_TYPES.Property) {
    return getIdentifier(node.value);
  }

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    return getIdentifier(node.property);
  }

  if (node.type === AST_NODE_TYPES.CallExpression) {
    return getIdentifier(node.callee);
  }

  return;
};

export const getBaseIdentifier = (
  identifier: TSESTree.Identifier,
): TSESTree.Node | undefined => {
  // Ignore .optional()
  if (
    identifier.name === 'optional' &&
    identifier.parent?.type === AST_NODE_TYPES.MemberExpression
  ) {
    return identifier.parent.object;
  }
  return identifier;
};
