import { RuleTester } from '@typescript-eslint/rule-tester';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'prefer-zod-default';

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
  valid: [test('string-default')],
  invalid: [
    {
      ...test('string-meta-default'),
      errors: [{ messageId: 'prefer' }],
    },
  ],
});
