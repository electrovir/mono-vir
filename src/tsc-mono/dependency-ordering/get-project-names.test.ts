import {itCases} from '@augment-vir/chai';
import {testRepos} from '../../test-helpers/file-paths.test-helper';
import {getProjects} from './get-project-names';

describe(getProjects.name, () => {
    itCases(getProjects, [
        {
            it: 'gets only typescript project directories',
            input: testRepos['augment-vir'],
            expect: [
                {
                    dirRelativePath: 'packages/browser',
                    npmName: '@augment-vir/browser',
                },
                {
                    dirRelativePath: 'packages/browser-testing',
                    npmName: '@augment-vir/browser-testing',
                },
                {
                    dirRelativePath: 'packages/chai',
                    npmName: '@augment-vir/chai',
                },
                {
                    dirRelativePath: 'packages/common',
                    npmName: '@augment-vir/common',
                },
                {
                    dirRelativePath: 'packages/common-tests',
                    npmName: '@augment-vir/common-tests',
                },
                {
                    dirRelativePath: 'packages/docker',
                    npmName: '@augment-vir/docker',
                },
                {
                    dirRelativePath: 'packages/element-vir',
                    npmName: '@augment-vir/element-vir',
                },
                {
                    dirRelativePath: 'packages/node-js',
                    npmName: '@augment-vir/node-js',
                },
                {
                    dirRelativePath: 'packages/prisma-node-js',
                    npmName: '@augment-vir/prisma-node-js',
                },
                {
                    dirRelativePath: 'packages/scripts',
                    npmName: '@augment-vir/scripts',
                },
                {
                    dirRelativePath: 'packages/testing',
                    npmName: '@augment-vir/testing',
                },
            ],
        },
    ]);
});
