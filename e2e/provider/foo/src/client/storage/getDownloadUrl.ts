import { taskEither } from 'fp-ts';

import type { FooClient } from '../env';
type Type = FooClient['storage']['getDownloadUrl'];

export const getDownloadUrl: Type = (_env) => (_p) => taskEither.right('');
