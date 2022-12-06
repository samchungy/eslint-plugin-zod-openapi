import { ESLintUtils } from '@typescript-eslint/utils';

import { setupHelpers } from '../../tests/helper';

const ruleName = 'require-comment';

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
    test('string-description'),
    test('object-property-description'),
    test('string-deprecated'),
    test('object-property-deprecated'),
  ],
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
      ...test('string-description-wrong-comment-indent', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('string-description-no-comment-indent', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('object-property-description-no-comment', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test(
        'object-property-description-no-comment-same-line-disable-prettier',
        true,
      ),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test(
        'object-property-description-no-comment-same-line-prop-disable-prettier',
        true,
      ),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('object-property-wrong-description', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('string-deprecated-no-comment', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('string-deprecated-wrong-comment', true),
      errors: [{ messageId: 'comment' }],
    },
    {
      ...test('object-property-description-no-deprecated', true),
      errors: [{ messageId: 'comment' }],
    },
  ],
});
