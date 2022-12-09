import { TSESTree } from '@typescript-eslint/utils';

const findOpenApiInChain = (
  root: TSESTree.CallExpression,
): TSESTree.CallExpression | undefined => {
  const callee = root.callee;
  if (callee.type !== 'MemberExpression') {
    return;
  }

  const property = callee.property;
  if (property.type === 'Identifier') {
    if (property.name === 'openapi') {
      return root;
    }

    if (property.name === 'register' && root.arguments?.[1]) {
      return findOpenApiCallExpression(root.arguments[1]);
    }
  }

  if (callee.object.type === 'CallExpression') {
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
  if (node.type === 'VariableDeclarator') {
    const init = node.init;
    if (!init || init.type !== 'CallExpression') {
      return;
    }

    return findOpenApiInChain(init);
  }

  if (node.type === 'Property') {
    const value = node.value;
    if (!value || value.type !== 'CallExpression') {
      return;
    }

    return findOpenApiInChain(value);
  }

  if (node.type === 'CallExpression') {
    return findOpenApiInChain(node);
  }

  return undefined;
};

export const getIdentifier = <T extends TSESTree.Node>(
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

  if (node.type === 'CallExpression') {
    return getIdentifier(node.callee);
  }

  return;
};

export const getBaseIdentifier = (
  identifier: TSESTree.Identifier,
): TSESTree.Node | undefined => {
  if (
    identifier.name === 'register' &&
    identifier.parent?.type === 'MemberExpression' &&
    identifier.parent.parent?.type === 'CallExpression'
  ) {
    const callExpression = identifier.parent.parent;
    if (!callExpression) {
      return;
    }

    return callExpression.arguments?.[2];
  }

  // Ignore .optional()
  if (
    identifier.name === 'optional' &&
    identifier.parent?.type === 'MemberExpression'
  ) {
    return identifier.parent.object;
  }
  return identifier;
};
