import { readdirSync } from 'node:fs';
import path from 'node:path';

import type { TSESLint } from '@typescript-eslint/utils';
const rulesDir = path.join(__dirname, 'rules');
const ruleFolders = readdirSync(rulesDir);

type RuleModule = TSESLint.RuleModule<string, unknown[]> & { name: string };

const rules = ruleFolders.reduce<Record<string, RuleModule>>((acc, curr) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { rule } = require(path.join(rulesDir, curr, 'rule')) as {
    rule: RuleModule;
  };
  acc[curr] = rule;
  return acc;
}, {});

export = { rules };
