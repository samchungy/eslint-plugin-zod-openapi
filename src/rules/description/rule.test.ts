/* eslint-disable @typescript-eslint/no-floating-promises */
import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'description';

const { test } = setupHelpers(ruleName);

import { rule } from './rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(ruleName, rule, {
  valid: [test('string-description')],
  invalid: [
    {
      ...test('string-no-description'),
      errors: [{ messageId: 'required' }],
    },
    {
      ...test('string-description-no-comment', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('string-description-wrong-comment', true),
      errors: [{ messageId: 'comment' }],
    },
  ],
});
