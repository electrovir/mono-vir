import {type ArrayElement, mapObjectValues, omitObjectKeys} from '@augment-vir/common';
import {type ShellOutput} from '@augment-vir/node';
import {describe, snapshotCases} from '@augment-vir/test';
import {runPackageCli} from 'test-as-package';
import {testRepos} from '../file-paths.mock.js';
import {sanitizeTestOutput} from '../sanitize-output.mock.js';

describe('cli', () => {
    const outputKeysToIgnore = [
        'error',
        'exitSignal',
    ] as const satisfies ReadonlyArray<keyof ShellOutput>;

    snapshotCases(
        async (
            cwd: string,
            command: string,
            trimKeys: (keyof Omit<ShellOutput, ArrayElement<typeof outputKeysToIgnore>>)[] = [],
        ) => {
            const finalArgs = command.split(' ');
            const output = await runPackageCli({
                cwd,
                commandArgs: finalArgs,
            });
            return mapObjectValues(
                omitObjectKeys(
                    {
                        ...output,
                        args: finalArgs.join(' '),
                    },
                    [
                        ...outputKeysToIgnore,
                        ...trimKeys,
                    ],
                ),
                (key, value) => sanitizeTestOutput(value),
            );
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
            },
            {
                it: 'for-each: errors if one of the scripts fails',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each npm run --silent mono-vir-test:one-failure',
                ],
            },
            {
                it: 'for-each: errors if the given command is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'fake-command npm run --silent mono-vir-test:success',
                ],
            },
            {
                it: 'for-each: errors if no inputs are given to for-each',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each',
                ],
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
                    ['stdout'],
                ],
            },
            {
                it: 'for-each-async: errors if one of the scripts fails',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each-async npm run --silent mono-vir-test:one-failure',
                    ['stdout'],
                ],
            },
            {
                it: 'for-each-async: errors if the given command is invalid',
                inputs: [
                    testRepos['augment-vir'],
                    'fake-command npm run --silent mono-vir-test:success',
                ],
            },
            {
                it: 'for-each-async: errors if no inputs are given to for-each-async',
                inputs: [
                    testRepos['augment-vir'],
                    'for-each-async',
                ],
            },
        ],
    );
});
