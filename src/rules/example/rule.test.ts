/* eslint-disable @typescript-eslint/no-floating-promises */
import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'example';

const { test } = setupHelpers(ruleName);

import { rule } from './rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(ruleName, rule, {
  valid: [],
  invalid: [
    { ...test('string-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('number-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('enum-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('boolean-no-example'), errors: [{ messageId: 'required' }] },
    { ...test('record-no-example'), errors: [{ messageId: 'required' }] },
  ],
});
