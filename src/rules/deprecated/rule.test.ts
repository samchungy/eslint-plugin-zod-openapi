/* eslint-disable @typescript-eslint/no-floating-promises */
import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'deprecated';

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
    // test('string-no-deprecation'), test('string-deprecation-comment')
  ],
  invalid: [
    // {
    //   ...test('string-deprecation-no-comment-disable-lint', true),
    //   errors: [{ messageId: 'comment' }],
    // },
    // {
    //   ...test('string-deprecation-comment-no-tag', true),
    //   errors: [{ messageId: 'comment' }],
    // },
    // {
    //   ...test('object-property-no-comment-disable-lint', true),
    //   errors: [{ messageId: 'comment' }],
    // },
    {
      ...test('object-property-comment-no-tag', true),
      errors: [{ messageId: 'comment' }],
    },
  ],
});
