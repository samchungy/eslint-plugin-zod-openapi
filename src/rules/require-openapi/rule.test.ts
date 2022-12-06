import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

import { rule } from './rule';

const ruleName = 'require-openapi';

const { test } = setupHelpers(ruleName);
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(ruleName, rule, {
  valid: [
    test('object-property-description'),
    test('object-property-reference'),
  ],
  invalid: [
    {
      ...test('string-no-openapi'),
      errors: [{ messageId: 'open-api-required' }],
    },
    {
      ...test('object-property-no-description'),
      errors: [{ messageId: 'open-api-required' }],
    },
  ],
});
