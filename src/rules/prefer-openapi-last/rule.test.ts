import { RuleTester } from '@typescript-eslint/rule-tester';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'prefer-openapi-last';

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
  valid: [],
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
