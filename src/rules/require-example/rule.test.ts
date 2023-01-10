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
    { ...test('string-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('number-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('boolean-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('record-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('enum-no-example'), errors: [{ messageId: 'required' }] },
    {
      ...test('string-optional-no-example'),
      errors: [{ messageId: 'required' }],
    },
    {
      ...test('string-no-example'),
      errors: [{ messageId: 'required' }],
      options: ['examples'],
    },
  ],
});
