import {describe, itCases} from '@augment-vir/test';
import {testRepos} from '../../file-paths.mock.js';
import {getRelativePosixPackagePathsInDependencyOrder} from './get-package-dependency-order.js';

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
