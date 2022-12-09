import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'prefer-openapi-last';

const { test } = setupHelpers(ruleName);

import { rule } from './rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(ruleName, rule, {
  valid: [test('registry')],
  invalid: [
    {
      ...test('string-default-last'),
      errors: [{ messageId: 'requires' }],
    },
    {
      ...test('object-property-default-last'),
      errors: [{ messageId: 'requires' }],
    },
  ],
});
