/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-return-void */
// eslint-disable-next-line functional/no-return-void

import * as cp from 'child_process';

import { build } from './build';

export function test(): void {
  console.log('Start test');
  build();
  const cmd = cp.spawn(
    'firebase',
    ['emulators:exec', '"jest && cypress run"'],
    {
      shell: true,
    }
  );

  cmd.stdout.on('data', (data: Buffer) =>
    process.stdout.write(data.toString())
  );
  cmd.stderr.on('data', (data: Buffer) =>
    process.stderr.write(data.toString())
  );
  cmd.on('exit', (code) => {
    console.log(`Done test with exit code: ${code?.toString() ?? ''}`);
  });
}
