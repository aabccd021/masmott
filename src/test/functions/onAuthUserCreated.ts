import { either, option, taskEither } from 'fp-ts';
import { identity, pipe } from 'fp-ts/function';
import type { DeepPick } from 'ts-essentials';

import type { Stack as S } from '../../type';
import { defineTest, toFunctionsPath } from '../util';

export const test2 = defineTest({
  name: `onAuthUserCreated trigger can upsert doc`,
  functionsBuilders: {
    fn1: (server) => ({
      functions: {
        saveLatestCreatedUser: {
          trigger: 'onAuthUserCreated',
          handler: ({ authUser }) =>
            server.db.upsertDoc({
              key: { collection: 'authUser', id: 'latestCreated' },
              data: { uid: authUser.uid },
            }),
        },
      },
    }),
  },
  expect: ({
    client,
    ci,
    server,
  }: DeepPick<
    S.Type,
    {
      readonly client: {
        readonly auth: { readonly createUserAndSignInWithEmailAndPassword: never };
        readonly db: { readonly getDocWhen: never };
      };
      readonly ci: { readonly deployDb: never; readonly deployFunctions: never };
      readonly server: { readonly db: { readonly upsertDoc: never } };
    }
  >) =>
    pipe(
      ci.deployDb({
        type: 'deploy',
        collections: {
          authUser: {
            schema: { created: { type: 'StringField' } },
            securityRule: { get: { type: 'True' } },
          },
        },
      }),
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
        client.auth.createUserAndSignInWithEmailAndPassword({
          email: 'kira@sakurazaka.com',
          password: 'dorokatsu',
        })
      ),
      taskEither.bindTo('signInResult'),
      taskEither.bind('latestCreatedUserDoc', () =>
        taskEither.fromTask(
          client.db.getDocWhen({
            key: { collection: 'authUser', id: 'latestCreated' },
            select: either.match(() => option.none, identity),
          })
        )
      ),
      taskEither.map(
        ({ signInResult, latestCreatedUserDoc }) =>
          latestCreatedUserDoc['uid'] === signInResult.authUser.uid
      )
    ),
  toResult: either.right(true),
});

export const test3 = defineTest({
  name: `onAuthUserCreated trigger should not be called if not triggered`,
  type: 'fail',
  functionsBuilders: {
    fn1: (server) => ({
      functions: {
        saveLatestCreatedUser: {
          trigger: 'onAuthUserCreated',
          handler: ({ authUser }) =>
            server.db.upsertDoc({
              key: { collection: 'authUser', id: 'latestCreated' },
              data: { uid: authUser.uid },
            }),
        },
      },
    }),
  },
  expect: ({
    client,
    ci,
    server,
  }: DeepPick<
    S.Type,
    {
      readonly client: {
        readonly db: { readonly getDocWhen: never };
      };
      readonly ci: { readonly deployDb: never; readonly deployFunctions: never };
      readonly server: { readonly db: { readonly upsertDoc: never } };
    }
  >) =>
    pipe(
      ci.deployDb({
        type: 'deploy',
        collections: {
          authUser: {
            schema: { created: { type: 'StringField' } },
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
          key: { collection: 'authUser', id: 'latestCreated' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ created: 'true' }),
});

export const test4 = defineTest({
  name: `document should not be created if trigger not deployed`,
  type: 'fail',
  expect: ({
    client,
    ci,
  }: DeepPick<
    S.Type,
    {
      readonly client: {
        readonly auth: { readonly createUserAndSignInWithEmailAndPassword: never };
        readonly db: { readonly getDocWhen: never };
      };
      readonly ci: { readonly deployDb: never };
    }
  >) =>
    pipe(
      ci.deployDb({
        type: 'deploy',
        collections: {
          authUser: {
            schema: { created: { type: 'StringField' } },
            securityRule: { get: { type: 'True' } },
          },
        },
      }),
      taskEither.chainW(() =>
        client.auth.createUserAndSignInWithEmailAndPassword({
          email: 'kira@sakurazaka.com',
          password: 'dorokatsu',
        })
      ),
      taskEither.chainTaskK(() =>
        client.db.getDocWhen({
          key: { collection: 'authUser', id: 'latestCreated' },
          select: either.match(() => option.none, identity),
        })
      )
    ),
  toResult: either.right({ created: 'true' }),
});
