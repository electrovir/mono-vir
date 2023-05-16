import {itCases} from '@augment-vir/chai';
import {testRepos} from '../../test-helpers/file-paths.test-helper';
import {getRelativePosixPackagePathsInDependencyOrder} from './get-package-dependency-order';

describe(getRelativePosixPackagePathsInDependencyOrder.name, () => {
    itCases(getRelativePosixPackagePathsInDependencyOrder, [
        {
            it: 'reports the ts projects in correct order',
            input: testRepos['augment-vir'],
            expect: [
                'packages/common',
                'packages/testing',
                'packages/browser-testing',
                'packages/chai',
                'packages/browser',
                'packages/element-vir',
                'packages/node-js',
                'packages/common-tests',
                'packages/docker',
                'packages/prisma-node-js',
                'packages/scripts',
            ],
        },
    ]);
});
