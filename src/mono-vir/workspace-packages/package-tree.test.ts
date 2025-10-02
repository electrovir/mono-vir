import {assert} from '@augment-vir/assert';
import {omitObjectKeys} from '@augment-vir/common';
import {it, itCases} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {readFile, rm} from 'node:fs/promises';
import {describe} from 'node:test';
import {exampleGraphFilePath, testOutputGraphFilePath, testRepos} from '../../file-paths.mock.js';
import {createPackageTree, writePackageDepsToFile} from './package-tree.js';

describe(createPackageTree.name, () => {
    const expectedResults: Awaited<ReturnType<typeof testCreatePackageTree>> = {
        packagesByName: {
            '@augment-vir/browser': {
                allDeps: [
                    '@augment-vir/browser-testing',
                    '@open-wc/testing',
                    '@types/mocha',
                    '@web/dev-server-esbuild',
                    '@web/test-runner',
                    '@web/test-runner-commands',
                    '@web/test-runner-playwright',
                    '@web/test-runner-visual-regression',
                    'element-vir',
                    'istanbul-smart-text-reporter',
                    'typescript',
                    '@augment-vir/common',
                ],
                dirRelativePath: 'packages/browser',
                npmName: '@augment-vir/browser',
            },
            '@augment-vir/browser-testing': {
                allDeps: [
                    '@web/dev-server-esbuild',
                    '@web/test-runner',
                    '@web/test-runner-playwright',
                    '@web/test-runner-visual-regression',
                    'istanbul-smart-text-reporter',
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/testing',
                    '@open-wc/testing',
                    '@types/mocha',
                    '@web/test-runner-commands',
                    'type-fest',
                ],
                dirRelativePath: 'packages/browser-testing',
                npmName: '@augment-vir/browser-testing',
            },
            '@augment-vir/chai': {
                allDeps: [
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/testing',
                    '@types/chai-as-promised',
                    'chai-as-promised',
                    'expect-type',
                    'test-established-expectations',
                    'type-fest',
                ],
                dirRelativePath: 'packages/chai',
                npmName: '@augment-vir/chai',
            },
            '@augment-vir/common': {
                allDeps: [
                    'typescript',
                    'type-fest',
                ],
                dirRelativePath: 'packages/common',
                npmName: '@augment-vir/common',
            },
            '@augment-vir/common-tests': {
                allDeps: [
                    '@augment-vir/chai',
                    '@augment-vir/node-js',
                    '@electrovir/nyc',
                    '@istanbuljs/nyc-config-typescript',
                    '@types/chai',
                    '@types/mocha',
                    'chai',
                    'expect-type',
                    'istanbul-smart-text-reporter',
                    'mocha',
                    'mocha-spec-reporter-with-file-names',
                    'ts-node',
                    'type-fest',
                    'typescript',
                ],
                dirRelativePath: 'packages/common-tests',
                npmName: '@augment-vir/common-tests',
            },
            '@augment-vir/docker': {
                allDeps: [
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                dirRelativePath: 'packages/docker',
                npmName: '@augment-vir/docker',
            },
            '@augment-vir/element-vir': {
                allDeps: [
                    '@augment-vir/browser-testing',
                    '@open-wc/testing',
                    '@types/mocha',
                    '@web/dev-server-esbuild',
                    '@web/test-runner',
                    '@web/test-runner-commands',
                    '@web/test-runner-playwright',
                    '@web/test-runner-visual-regression',
                    'istanbul-smart-text-reporter',
                    'typescript',
                    '@augment-vir/common',
                    'element-vir',
                ],
                dirRelativePath: 'packages/element-vir',
                npmName: '@augment-vir/element-vir',
            },
            '@augment-vir/node-js': {
                allDeps: [
                    '@augment-vir/chai',
                    '@electrovir/nyc',
                    '@istanbuljs/nyc-config-typescript',
                    '@types/chai',
                    '@types/chai-as-promised',
                    '@types/fs-extra',
                    '@types/mocha',
                    '@types/node',
                    'chai',
                    'chai-as-promised',
                    'istanbul-smart-text-reporter',
                    'mocha',
                    'mocha-spec-reporter-with-file-names',
                    'ts-node',
                    'typescript',
                    '@augment-vir/common',
                    'ansi-colors',
                    'axios',
                    'fs-extra',
                    'ts-node',
                    'type-fest',
                ],
                dirRelativePath: 'packages/node-js',
                npmName: '@augment-vir/node-js',
            },
            '@augment-vir/prisma-node-js': {
                allDeps: [
                    'istanbul-smart-text-reporter',
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                dirRelativePath: 'packages/prisma-node-js',
                npmName: '@augment-vir/prisma-node-js',
            },
            '@augment-vir/scripts': {
                allDeps: [
                    '@electrovir/nyc',
                    '@istanbuljs/nyc-config-typescript',
                    '@types/chai',
                    '@types/mocha',
                    '@types/node',
                    'chai',
                    'istanbul-smart-text-reporter',
                    'mocha',
                    'mocha-spec-reporter-with-file-names',
                    'ts-node',
                    'type-fest',
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                dirRelativePath: 'packages/scripts',
                npmName: '@augment-vir/scripts',
            },
            '@augment-vir/testing': {
                allDeps: [
                    '@electrovir/nyc',
                    '@istanbuljs/nyc-config-typescript',
                    '@types/mocha',
                    'chai',
                    'istanbul-smart-text-reporter',
                    'mocha',
                    'mocha-spec-reporter-with-file-names',
                    'ts-node',
                    'typescript',
                    '@augment-vir/common',
                    '@types/chai',
                    'expect-type',
                    'mock-vir',
                    'type-fest',
                ],
                dirRelativePath: 'packages/testing',
                npmName: '@augment-vir/testing',
            },
        },
        packagesGraph: {
            '@augment-vir/browser': {},
            '@augment-vir/browser-testing': {
                '@augment-vir/browser': {},
                '@augment-vir/element-vir': {},
            },
            '@augment-vir/common': {
                '@augment-vir/browser': {},
                '@augment-vir/browser-testing': {
                    '@augment-vir/browser': {},
                    '@augment-vir/element-vir': {},
                },
                '@augment-vir/chai': {
                    '@augment-vir/common-tests': {},
                    '@augment-vir/node-js': {
                        '@augment-vir/common-tests': {},
                        '@augment-vir/docker': {},
                        '@augment-vir/prisma-node-js': {},
                        '@augment-vir/scripts': {},
                    },
                },
                '@augment-vir/docker': {},
                '@augment-vir/element-vir': {},
                '@augment-vir/node-js': {
                    '@augment-vir/common-tests': {},
                    '@augment-vir/docker': {},
                    '@augment-vir/prisma-node-js': {},
                    '@augment-vir/scripts': {},
                },
                '@augment-vir/prisma-node-js': {},
                '@augment-vir/scripts': {},
                '@augment-vir/testing': {
                    '@augment-vir/browser-testing': {
                        '@augment-vir/browser': {},
                        '@augment-vir/element-vir': {},
                    },
                    '@augment-vir/chai': {
                        '@augment-vir/common-tests': {},
                        '@augment-vir/node-js': {
                            '@augment-vir/common-tests': {},
                            '@augment-vir/docker': {},
                            '@augment-vir/prisma-node-js': {},
                            '@augment-vir/scripts': {},
                        },
                    },
                },
            },
            '@augment-vir/testing': {
                '@augment-vir/browser-testing': {
                    '@augment-vir/browser': {},
                    '@augment-vir/element-vir': {},
                },
                '@augment-vir/chai': {
                    '@augment-vir/common-tests': {},
                    '@augment-vir/node-js': {
                        '@augment-vir/common-tests': {},
                        '@augment-vir/docker': {},
                        '@augment-vir/prisma-node-js': {},
                        '@augment-vir/scripts': {},
                    },
                },
            },
            '@augment-vir/chai': {
                '@augment-vir/common-tests': {},
                '@augment-vir/node-js': {
                    '@augment-vir/common-tests': {},
                    '@augment-vir/docker': {},
                    '@augment-vir/prisma-node-js': {},
                    '@augment-vir/scripts': {},
                },
            },
            '@augment-vir/common-tests': {},
            '@augment-vir/node-js': {
                '@augment-vir/common-tests': {},
                '@augment-vir/docker': {},
                '@augment-vir/prisma-node-js': {},
                '@augment-vir/scripts': {},
            },
            '@augment-vir/docker': {},
            '@augment-vir/element-vir': {},
            '@augment-vir/prisma-node-js': {},
            '@augment-vir/scripts': {},
        },
    };

    async function testCreatePackageTree(cwd: string) {
        const results = await createPackageTree(cwd);

        /**
         * `packagesTree` is circular so we can't easily create a representation for test
         * expectations.
         */
        return omitObjectKeys(results, ['packagesTree']);
    }

    itCases(testCreatePackageTree, [
        {
            it: 'works',
            input: testRepos['augment-vir'],
            expect: expectedResults,
        },
    ]);
});

describe(writePackageDepsToFile.name, () => {
    it('writes a file', async () => {
        await rm(testOutputGraphFilePath, {force: true});
        assert.isFalse(existsSync(testOutputGraphFilePath));

        const {filePath, svg} = await writePackageDepsToFile({
            cwd: testRepos['augment-vir'],
            filePath: testOutputGraphFilePath,
        });

        assert.strictEquals(testOutputGraphFilePath, filePath);
        assert.isTrue(existsSync(testOutputGraphFilePath));

        const outputContents = String(await readFile(filePath));
        const expectedContents = String(await readFile(exampleGraphFilePath));

        assert.strictEquals(outputContents, svg);
        assert.strictEquals(svg, expectedContents);
    });
});
