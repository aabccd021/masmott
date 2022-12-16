import { either, option, task, taskEither } from 'fp-ts';
import { identity, pipe } from 'fp-ts/function';

import type { DeployFunctionParam, Stack as S } from '../../type';
import type { Suite } from '../util';
import { defineTest, toFunctionsPath } from '../util';

export const test1 = defineTest({
  name: `onObjectCreated trigger params contains object id with client.storage.uploadDataUrlAwaitFunctions`,
  functionsBuilders: {
    fn1: (server: S.server.Type): DeployFunctionParam => ({
      functions: {
        saveCreatedObjects: {
          trigger: 'onObjectCreated',
          handler: (params) =>
            task.delay(1000)(
              server.db.upsertDoc({
                key: { collection: 'storageObject', id: params.object.key },
                data: { exists: 'true' },
              })
            ),
        },
      },
    }),
  },
  expect: ({ client, ci, server }) =>
    pipe(
      ci.deployStorage({
        securityRule: {
          create: [{ type: 'True' }],
        },
      }),
      taskEither.chainW(() =>
        ci.deployDb({
          type: 'deploy',
          collections: {
            storageObject: {
              schema: { exists: { type: 'StringField' } },
              securityRule: { get: { type: 'True' } },
            },
          },
        })
      ),
      taskEither.chainW(() =>
        ci.deployFunctions({
          functions: {
            filePath: toFunctionsPath(__filename),
            exportPath: ['test1', 'functionsBuilders', 'fn1'],
          },
          server,
        })
      ),
      taskEither.chainW(() =>
        client.storage.uploadDataUrlAwaitFunctions({
          key: 'kira_object_id',
          dataUrl: `data:;base64,${Buffer.from('kira masumoto').toString('base64')}`,
        })
      ),
      taskEither.chainTaskK(() =>
        client.db.getDocWhen({
          key: { collection: 'storageObject', id: 'kira_object_id' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ exists: 'true' }),
});

export const test14 = defineTest({
  name: `uploadDataUrl should wait all functions to be finised with client.storage.uploadDataUrlAwaitFunctions`,
  functionsBuilders: {
    fn1: (server: S.server.Type): DeployFunctionParam => ({
      functions: {
        saveCreatedObjects: {
          trigger: 'onObjectCreated',
          handler: (params) =>
            task.delay(1000)(
              server.db.upsertDoc({
                key: { collection: 'storageObject', id: params.object.key },
                data: { exists: 'true' },
              })
            ),
        },
      },
    }),
  },
  expect: ({ client, ci, server }) =>
    pipe(
      ci.deployStorage({
        securityRule: {
          create: [{ type: 'True' }],
        },
      }),
      taskEither.chainW(() =>
        ci.deployDb({
          type: 'deploy',
          collections: {
            storageObject: {
              schema: { exists: { type: 'StringField' } },
              securityRule: { get: { type: 'True' } },
            },
          },
        })
      ),
      taskEither.chainW(() =>
        ci.deployFunctions({
          functions: {
            filePath: toFunctionsPath(__filename),
            exportPath: ['test14', 'functionsBuilders', 'fn1'],
          },
          server,
        })
      ),
      taskEither.chainW(() =>
        client.storage.uploadDataUrlAwaitFunctions({
          key: 'kira_object_id',
          dataUrl: `data:;base64,${Buffer.from('kira masumoto').toString('base64')}`,
        })
      ),
      taskEither.chainW(() =>
        client.db.getDoc({
          key: { collection: 'storageObject', id: 'kira_object_id' },
        })
      )
    ),
  toResult: either.right(option.some({ exists: 'true' })),
});

export const test2 = defineTest({
  name: `onObjectCreated trigger params contains object id`,
  functionsBuilders: {
    fn1: (server: S.server.Type): DeployFunctionParam => ({
      functions: {
        saveCreatedObjects: {
          trigger: 'onObjectCreated',
          handler: (params) =>
            task.delay(1000)(
              server.db.upsertDoc({
                key: { collection: 'storageObject', id: params.object.key },
                data: { exists: 'true' },
              })
            ),
        },
      },
    }),
  },
  expect: ({ client, ci, server }) =>
    pipe(
      ci.deployStorage({
        securityRule: {
          create: [{ type: 'True' }],
        },
      }),
      taskEither.chainW(() =>
        ci.deployDb({
          type: 'deploy',
          collections: {
            storageObject: {
              schema: { exists: { type: 'StringField' } },
              securityRule: { get: { type: 'True' } },
            },
          },
        })
      ),
      taskEither.chainW(() =>
        ci.deployFunctions({
          functions: {
            filePath: toFunctionsPath(__filename),
            exportPath: ['test2', 'functionsBuilders', 'fn1'],
          },
          server,
        })
      ),
      taskEither.chainW(() =>
        client.storage.uploadDataUrl({
          key: 'masumoto_object_id',
          dataUrl: `data:;base64,${Buffer.from('kira masumoto').toString('base64')}`,
        })
      ),
      taskEither.chainTaskK(() =>
        client.db.getDocWhen({
          key: { collection: 'storageObject', id: 'masumoto_object_id' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ exists: 'true' }),
});

export const test24 = defineTest({
  name: `uploadDataUrl should not wait functions to be finished`,
  functionsBuilders: {
    fn1: (server: S.server.Type): DeployFunctionParam => ({
      functions: {
        saveCreatedObjects: {
          trigger: 'onObjectCreated',
          handler: (params) =>
            task.delay(1000)(
              server.db.upsertDoc({
                key: { collection: 'storageObject', id: params.object.key },
                data: { exists: 'true' },
              })
            ),
        },
      },
    }),
  },

  expect: ({ client, ci, server }) =>
    pipe(
      ci.deployStorage({
        securityRule: {
          create: [{ type: 'True' }],
        },
      }),
      taskEither.chainW(() =>
        ci.deployDb({
          type: 'deploy',
          collections: {
            storageObject: {
              schema: { exists: { type: 'StringField' } },
              securityRule: { get: { type: 'True' } },
            },
          },
        })
      ),
      taskEither.chainW(() =>
        ci.deployFunctions({
          functions: {
            filePath: toFunctionsPath(__filename),
            exportPath: ['test24', 'functionsBuilders', 'fn1'],
          },
          server,
        })
      ),
      taskEither.chainW(() =>
        client.storage.uploadDataUrl({
          key: 'kira_object_id',
          dataUrl: `data:;base64,${Buffer.from('kira masumoto').toString('base64')}`,
        })
      ),
      taskEither.chainW(() =>
        client.db.getDoc({
          key: { collection: 'storageObject', id: 'kira_object_id' },
        })
      )
    ),
  toResult: either.right(option.none),
});

export const test3 = defineTest({
  name: `onObjectCreated trigger should not be called if not triggered`,
  type: 'fail',
  functionsBuilders: {
    fn1: (server: S.server.Type): DeployFunctionParam => ({
      functions: {
        saveCreatedObjects: {
          trigger: 'onObjectCreated',
          handler: (params) =>
            task.delay(1000)(
              server.db.upsertDoc({
                key: { collection: 'storageObject', id: params.object.key },
                data: { exists: 'true' },
              })
            ),
        },
      },
    }),
  },
  expect: ({ client, ci, server }) =>
    pipe(
      ci.deployDb({
        type: 'deploy',
        collections: {
          detection: {
            schema: { exists: { type: 'StringField' } },
            securityRule: { get: { type: 'True' } },
          },
        },
      }),
      taskEither.chainW(() =>
        ci.deployFunctions({
          functions: {
            filePath: toFunctionsPath(__filename),
            exportPath: ['test3', 'functionsBuilders', 'fn1'],
          },
          server,
        })
      ),
      taskEither.chainTaskK(() =>
        client.db.getDocWhen({
          key: { collection: 'storageObject', id: 'kira_object_id' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ exists: 'true' }),
});

export const test4 = defineTest({
  name: `document should not be created if trigger not deployed`,
  type: 'fail',
  expect: ({ client, ci }) =>
    pipe(
      ci.deployDb({
        type: 'deploy',
        collections: {
          storageObject: {
            schema: { exists: { type: 'StringField' } },
            securityRule: { get: { type: 'True' } },
          },
        },
      }),
      taskEither.chainW(() =>
        client.storage.uploadDataUrl({
          key: 'kira_object_id',
          dataUrl: `data:;base64,${Buffer.from('kira masumoto').toString('base64')}`,
        })
      ),
      taskEither.chainTaskK(() =>
        client.db.getDocWhen({
          key: { collection: 'storageObject', id: 'kira_object_id' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ exists: 'true' }),
});

export const suite: Suite = {
  name: 'onObjectCreated functions',
  tests: [test1, test14, test2, test24, test3, test4],
};
