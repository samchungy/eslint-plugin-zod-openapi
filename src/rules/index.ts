import { rule as commentRule } from './comment/rule';
import { rule as defaultRule } from './default/rule';
import { rule as exampleRule } from './example/rule';
import { rule as openapiRule } from './openapi/rule';

export const rules = {
  'must-have-matching-comments': commentRule,
  'prefer-zod-default': defaultRule,
  'primative-must-have-example': exampleRule,
  'must-have-openapi': openapiRule,
};
