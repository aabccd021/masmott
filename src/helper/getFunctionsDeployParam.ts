/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { taskEither } from 'fp-ts';

import type { DeployFunctionParam, Stack } from '../type';

export const getFunctionsDeployParam = (f: Stack.ci.DeployFunctions.Param) =>
  taskEither.tryCatch(
    async () =>
      await import(f.functions.filePath).then(
        (exports) =>
          f.functions.exportPath.reduce(
            (acc, cur) => acc[cur],
            exports
          )(f.server) as DeployFunctionParam
      ),
    (details) => ({ code: 'FailedLoadingFunctions' as const, details })
  );
