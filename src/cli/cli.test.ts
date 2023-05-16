import {ArrayElement, mapObjectValues, omitObjectKeys} from '@augment-vir/common';
import {ShellOutput} from '@augment-vir/node-js';
import {runPackageCli} from 'test-as-package';
import {expectationCases} from 'test-established-expectations';
import {testRepos} from '../test-helpers/file-paths.test-helper';
import {sanitizeTestOutput} from '../test-helpers/sanitize-output.test-helper';
import {noHelpFlag} from './parse-cli-args';

describe('cli', () => {
    const outputKeysToIgnore = [
        'error',
        'exitSignal',
    ] as const satisfies ReadonlyArray<keyof ShellOutput>;

    expectationCases(
        async (
            cwd: string,
            command: string,
            trimKeys: (keyof Omit<ShellOutput, ArrayElement<typeof outputKeysToIgnore>>)[] = [],
        ) => {
            const output = await runPackageCli({
                cwd: cwd,
                commandArgs: [
                    ...command.split(' '),
                    noHelpFlag,
                ],
            });
            return mapObjectValues(
                omitObjectKeys(output, [
                    ...outputKeysToIgnore,
                    ...trimKeys,
                ]),
                (key, value) => sanitizeTestOutput(String(value)),
            );
        },
        {
            testKey: 'cli',
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
