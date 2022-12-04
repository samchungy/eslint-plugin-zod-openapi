import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { findOpenApiCallExpression } from '../util/traverse';
import { getType } from '../util/type';

const isZodPrimative = (type: string): boolean =>
  ['ZodString', 'ZodNumber', 'ZodEnum', 'ZodBoolean', 'ZodRecord'].includes(
    type,
  );

const getDefault = (
  properties: TSESTree.ObjectLiteralElement[],
): TSESTree.Property | undefined => {
  for (const property of properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === 'default'
    ) {
      return property;
    }
  }
  return undefined;
};

const testDefault = (
  _node: TSESTree.Node,
  context: Readonly<TSESLint.RuleContext<any, any>>,
  openApiCallExpression: TSESTree.CallExpression,
) => {
  const argument = openApiCallExpression?.arguments[0];
  if (!argument || argument.type !== 'ObjectExpression') {
    return;
  }

  const def = getDefault(argument.properties);

  if (!def) {
    return;
  }

  return context.report({
    messageId: 'prefer',
    node: def,
  });
};

// eslint-disable-next-line new-cap
const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export const rule = createRule({
  create(context) {
    return {
      VariableDeclaration(node) {
        const declarator = node?.declarations[0];
        if (!declarator) {
          return;
        }

        if (declarator.init?.type === 'Identifier') {
          return;
        }

        const type = getType(declarator, context);
        if (
          !type?.isZodType ||
          !type.escapedName ||
          !isZodPrimative(type.escapedName)
        ) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(declarator);

        if (!openApiCallExpression) {
          return;
        }

        return testDefault(node, context, openApiCallExpression);
      },
      Property(node) {
        const type = getType(node, context);
        if (
          !type?.isZodType ||
          !type.escapedName ||
          !isZodPrimative(type.escapedName)
        ) {
          return;
        }

        const openApiCallExpression = findOpenApiCallExpression(node);

        if (!openApiCallExpression || node.value.type !== 'Identifier') {
          return;
        }

        return testDefault(node, context, openApiCallExpression);
      },
    };
  },
  name: 'open-api-example',
  meta: {
    fixable: 'code',
    type: 'problem',
    messages: {
      prefer: 'use .default() instead of .openapi() default',
    },
    schema: [],
    docs: {
      description: 'Requires that all zod primatives have an example',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});

// import { Rule } from 'eslint';
// import { Property } from 'estree';

// const createComment = (contents: string) => `/**
//  * ${contents}
//  */
// `;

// const getDeclaration = (node: Rule.Node): Rule.Node | undefined => {
//   if (node.parent.type === 'Program') {
//     return undefined;
//   }

//   if (
//     node.parent.type === 'VariableDeclaration' ||
//     node.parent.type === 'Property'
//   ) {
//     return node.parent;
//   }

//   return getDeclaration(node.parent);
// };

// const create: Rule.RuleModule['create'] = (context) => ({
//   CallExpression(node) {
//     if (
//       node.callee.type === 'MemberExpression' &&
//       node.callee.object.type === 'Identifier' &&
//       node.callee.object.name !== 'z'
//     ) {
//       return;
//     }

//     const variableDeclaration = getDeclaration(node);
//     if (!variableDeclaration) {
//       return;
//     }

//     if (
//       node.parent.type !== 'MemberExpression' ||
//       node.parent.property.type !== 'Identifier'
//     ) {
//       return;
//     }

//     if (node.parent.property.name === 'openapi') {
//       if (node.parent.parent.type !== 'CallExpression') {
//         return;
//       }
//       const argument = node.parent.parent.arguments[0];

//       if (argument.type !== 'ObjectExpression') {
//         return;
//       }

//       const descriptionProperty = argument.properties.find(
//         (property): property is Property =>
//           property.type === 'Property' &&
//           property.key.type === 'Identifier' &&
//           property.key.name === 'description',
//       );

//       if (!descriptionProperty) {
//         return context.report({
//           message: '.openapi description is required',
//           node,
//         });
//       }

//       const description =
//         descriptionProperty.value.type === 'Literal' &&
//         descriptionProperty.value.value;

//       if (typeof description !== 'string') {
//         return context.report({
//           message: '.openapi description must of type string',
//           node,
//         });
//       }

//       if (!description.length) {
//         return context.report({
//           message: '.openapi description must not be empty',
//           node,
//         });
//       }

//       const comment = context
//         .getSourceCode()
//         .getCommentsBefore(variableDeclaration)[0];

//       if (!comment) {
//         return context.report({
//           fix: (fixer) =>
//             fixer.insertTextBefore(
//               variableDeclaration,
//               createComment(description),
//             ),
//           message: 'comment matching .openapi description is required',
//           node,
//         });
//       }
//     }

//     // if (commentNode && comment !== description) {
//     //   return context.report({
//     //     fix: (fixer) => fixer.replaceTextRange(commentNode, description),
//     //     message: 'comment matching .openapi description is required',
//     //     node,
//     //   });
//     // }
//   },
//   MemberExpression(node) {
//     if (
//       node.property.type !== 'Identifier' ||
//       node.property.name !== 'openapi'
//     ) {
//       return;
//     }

//     const variableDeclaration = getDeclaration(node);
//     if (!variableDeclaration) {
//       return;
//     }

//     if (node.parent.parent.type === 'MemberExpression') {
//       return context.report({
//         message: '.openapi must be on the end of a zod chain',
//         node,
//       });
//     }

//     if (node.parent.type !== 'CallExpression') {
//       return;
//     }
//     const argument = node.parent.arguments[0];

//     if (argument.type !== 'ObjectExpression') {
//       return;
//     }

//     const descriptionProperty = argument.properties.find(
//       (property): property is Property =>
//         property.type === 'Property' &&
//         property.key.type === 'Identifier' &&
//         property.key.name === 'description',
//     );

//     if (!descriptionProperty) {
//       return;
//     }

//     const description =
//       descriptionProperty.value.type === 'Literal' &&
//       descriptionProperty.value.value;

//     if (typeof description !== 'string') {
//       return context.report({
//         message: '.openapi description must of type string',
//         node,
//       });
//     }

//     if (!description.length) {
//       return context.report({
//         message: '.openapi description must not be empty',
//         node,
//       });
//     }

//     const comment = context
//       .getSourceCode()
//       .getCommentsBefore(variableDeclaration)[0];

//     if (!comment) {
//       return context.report({
//         fix: (fixer) =>
//           fixer.insertTextBefore(
//             variableDeclaration,
//             createComment(description),
//           ),
//         message: 'comment matching .openapi description is required',
//         node,
//       });
//     }
//   },
// });

// const rule: Rule.RuleModule = {
//   create,
//   meta: {
//     fixable: 'code',
//     type: 'problem',
//     docs: {
//       description: 'Requires that zod objects contain an openapi description',
//     },
//   },
// };

// export = { rule };
