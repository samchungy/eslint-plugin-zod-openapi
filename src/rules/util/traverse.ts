import { TSESTree } from '@typescript-eslint/utils';

const findOpenApiInChain = (
  root: TSESTree.CallExpression,
): TSESTree.CallExpression | undefined => {
  const callee = root.callee;
  if (callee.type !== 'MemberExpression') {
    return;
  }

  const property = callee.property;
  if (property.type === 'Identifier' && property.name === 'openapi') {
    return root;
  }

  if (callee.object.type === 'CallExpression') {
    return findOpenApiInChain(callee.object);
  }

  return undefined;
};

export const findOpenApiCallExpression = (
  node: TSESTree.VariableDeclarator | TSESTree.Property,
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

  return;
};

const findLastNodeInChain = (
  root: TSESTree.CallExpression,
): TSESTree.CallExpression => {
  const callee = root.callee;
  if (callee.type !== 'MemberExpression') {
    return root;
  }

  if (callee.object.type === 'CallExpression') {
    return findLastNodeInChain(callee.object);
  }

  return root;
};

export const findLastNode = (
  declarator: TSESTree.VariableDeclarator,
): TSESTree.Node => {
  const init = declarator.init;
  if (!init || init.type !== 'CallExpression') {
    return declarator;
  }

  return findLastNodeInChain(init);
};
