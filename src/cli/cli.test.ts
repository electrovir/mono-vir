import {type ShellOutput} from '@augment-vir/node';
import {describe, itCases} from '@augment-vir/test';
import {runPackageCli} from 'test-as-package';
import {testRepos} from '../file-paths.mock.js';

describe('cli', () => {
    const outputKeysToIgnore = [
        'error',
        'exitSignal',
    ] as const satisfies ReadonlyArray<keyof ShellOutput>;

    itCases(
        async (cwd: string, command: string) => {
            const finalArgs = command.split(' ');
            const output = await runPackageCli({
                cwd,
                commandArgs: finalArgs,
            });
            return output.exitCode;
        },
        [
            /**
             * =========================
             *
             * For-each
             *
             * =========================
             */
            {
                it: 'for-each: successfully runs for-each',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each npm run --silent mono-vir-test:success',
                ],
                expect: 0,
            },
            {
                it: 'for-each: errors if one of the scripts fails',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each npm run --silent mono-vir-test:one-failure',
                ],
                expect: 1,
            },
            {
                it: 'for-each: errors if the given command is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'fake-command npm run --silent mono-vir-test:success',
                ],
                expect: 1,
            },
            {
                it: 'for-each: errors if no inputs are given to for-each',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each',
                ],
                expect: 1,
            },
            /**
             * =========================
             *
             * For-each-async
             *
             * =========================
             */
            {
                it: 'for-each-async: successfully runs for-each-async',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each-async npm run --silent mono-vir-test:success',
                ],
                expect: 0,
            },
            {
                it: 'for-each-async: errors if one of the scripts fails',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each-async npm run --silent mono-vir-test:one-failure',
                ],
                expect: 1,
            },
            {
                it: 'for-each-async: errors if the given command is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'fake-command npm run --silent mono-vir-test:success',
                ],
                expect: 1,
            },
            {
                it: 'for-each-async: errors if no inputs are given to for-each-async',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each-async',
                ],
                expect: 1,
            },
        ],
    );
});
