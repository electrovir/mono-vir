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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                    ],
                    devDependencies: [
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
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@augment-vir/testing',
                        '@open-wc/testing',
                        '@types/mocha',
                        '@web/test-runner-commands',
                        'type-fest',
                    ],
                    devDependencies: [
                        '@web/dev-server-esbuild',
                        '@web/test-runner',
                        '@web/test-runner-playwright',
                        '@web/test-runner-visual-regression',
                        'istanbul-smart-text-reporter',
                        'typescript',
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@augment-vir/testing',
                        '@types/chai-as-promised',
                        'chai-as-promised',
                        'expect-type',
                        'test-established-expectations',
                        'type-fest',
                    ],
                    devDependencies: [
                        'typescript',
                    ],
                },
                dirRelativePath: 'packages/chai',
                npmName: '@augment-vir/chai',
            },
            '@augment-vir/common': {
                allDeps: [
                    'typescript',
                    'type-fest',
                ],
                depsByType: {
                    dependencies: [
                        'type-fest',
                    ],
                    devDependencies: [
                        'typescript',
                    ],
                },
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
                depsByType: {
                    devDependencies: [
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
                },
                dirRelativePath: 'packages/common-tests',
                npmName: '@augment-vir/common-tests',
            },
            '@augment-vir/docker': {
                allDeps: [
                    'typescript',
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@augment-vir/node-js',
                    ],
                    devDependencies: [
                        'typescript',
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                    ],
                    devDependencies: [
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
                    ],
                    peerDependencies: [
                        'element-vir',
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        'ansi-colors',
                        'axios',
                        'fs-extra',
                        'ts-node',
                        'type-fest',
                    ],
                    devDependencies: [
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
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@augment-vir/node-js',
                    ],
                    devDependencies: [
                        'istanbul-smart-text-reporter',
                        'typescript',
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@augment-vir/node-js',
                    ],
                    devDependencies: [
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
                    ],
                },
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
                depsByType: {
                    dependencies: [
                        '@augment-vir/common',
                        '@types/chai',
                        'expect-type',
                        'mock-vir',
                        'type-fest',
                    ],
                    devDependencies: [
                        '@electrovir/nyc',
                        '@istanbuljs/nyc-config-typescript',
                        '@types/mocha',
                        'chai',
                        'istanbul-smart-text-reporter',
                        'mocha',
                        'mocha-spec-reporter-with-file-names',
                        'ts-node',
                        'typescript',
                    ],
                },
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
        allDependenciesByPackage: {
            '@augment-vir/browser': {
                dependencies: [
                    '@augment-vir/common',
                ],
                devDependencies: [
                    '@augment-vir/browser-testing',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/browser-testing': {
                dependencies: [
                    '@augment-vir/common',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/chai': {
                dependencies: [
                    '@augment-vir/common',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/common': {},
            '@augment-vir/common-tests': {
                devDependencies: [
                    '@augment-vir/chai',
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/docker': {
                dependencies: [
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                devDependencies: [
                    '@augment-vir/chai',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/element-vir': {
                dependencies: [
                    '@augment-vir/common',
                ],
                devDependencies: [
                    '@augment-vir/browser-testing',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/node-js': {
                dependencies: [
                    '@augment-vir/common',
                ],
                devDependencies: [
                    '@augment-vir/chai',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/prisma-node-js': {
                dependencies: [
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                devDependencies: [
                    '@augment-vir/chai',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/scripts': {
                dependencies: [
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ],
                devDependencies: [
                    '@augment-vir/chai',
                    '@augment-vir/testing',
                ],
            },
            '@augment-vir/testing': {
                dependencies: [
                    '@augment-vir/common',
                ],
            },
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
        await rm(testOutputGraphFilePath, {
            force: true,
        });
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
