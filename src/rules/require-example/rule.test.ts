import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'require-example';

const { test } = setupHelpers(ruleName);

import { rule } from './rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(ruleName, rule, {
  valid: [
    {
      ...test('string-example'),
    },
    {
      ...test('string-examples'),
      options: ['examples'],
    },
  ],
  invalid: [
    {
      ...test('string-no-example'),
      errors: [{ messageId: 'require-example' }],
    },
    {
      ...test('number-no-example'),
      errors: [{ messageId: 'require-example' }],
    },
    {
      ...test('boolean-no-example'),
      errors: [{ messageId: 'require-example' }],
    },
    {
      ...test('record-no-example'),
      errors: [{ messageId: 'require-example' }],
    },
    { ...test('enum-no-example'), errors: [{ messageId: 'require-example' }] },
    {
      ...test('string-optional-no-example'),
      errors: [{ messageId: 'require-example' }],
    },
    {
      ...test('string-no-example'),
      errors: [{ messageId: 'require-examples' }],
      options: ['examples'],
    },
    {
      ...test('string-no-example'),
      errors: [{ messageId: 'require-examples' }],
      options: ['examples'],
    },
  ],
});
