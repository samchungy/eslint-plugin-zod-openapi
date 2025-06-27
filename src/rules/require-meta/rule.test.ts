import { RuleTester } from '@typescript-eslint/rule-tester';

import { setupHelpers } from '../../tests/helper';

import { rule } from './rule';

const ruleName = 'require-meta';

const { test } = setupHelpers(ruleName);
const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
    },
  },
});

ruleTester.run(ruleName, rule, {
  valid: [
    test('object-property-description'),
    test('object-property-reference'),
    test('object-shape'),
    test('literal-no-meta'),
    test('optional-no-meta'),
    test('reference'),
    test('object-shape-reference'),
    test('object-property-reference-optional'),
    test('object-property-shape-optional'),
  ],
  invalid: [
    {
      ...test('string-no-meta'),
      errors: [{ messageId: 'meta-required' }],
    },
    {
      ...test('object-property-no-description'),
      errors: [{ messageId: 'meta-required' }],
    },
    {
      ...test('object-extend'),
      errors: [{ messageId: 'meta-required' }],
    },
    {
      ...test('object-property-optional'),
      errors: [{ messageId: 'meta-required' }],
    },
  ],
});
