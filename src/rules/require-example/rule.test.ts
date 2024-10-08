import { RuleTester } from '@typescript-eslint/rule-tester';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'require-example';

const { test } = setupHelpers(ruleName);

import { rule } from './rule';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
    },
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
  ],
});
