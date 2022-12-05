import fs from 'node:fs';
import path from 'node:path';

interface Test {
  name: string;
  code: string;
  output?: string;
}

export const setupHelpers = (rule: string) => {
  const test = (filePath: string, fix?: boolean): Test => ({
    name: `${filePath}${fix ? ' fix' : ''}`,
    // eslint-disable-next-line no-sync
    code: fs
      .readFileSync(
        path.join(process.cwd(), `src/rules/${rule}/tests/${filePath}.ts`),
      )
      .toString(),
    ...(fix && {
      // eslint-disable-next-line no-sync
      output: fs
        .readFileSync(
          path.join(
            process.cwd(),
            `src/rules/${rule}/tests/${filePath}-fix.ts`,
          ),
        )
        .toString(),
    }),
  });

  return {
    test,
  };
};
