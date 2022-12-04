import fs from 'node:fs';
import path from 'node:path';

export const readFile = (filePath: string): string =>
  // eslint-disable-next-line no-sync
  fs.readFileSync(path.join(__dirname, `${filePath}.ts`)).toString();

export const readFiles = (filePaths: string[]): string[] =>
  filePaths.map((filePath) => readFile(filePath));
