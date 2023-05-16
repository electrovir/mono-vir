import {itCases} from '@augment-vir/chai';
import {findLongestCommonPrefix} from './string';

describe(findLongestCommonPrefix.name, () => {
    itCases(findLongestCommonPrefix, [
        {
            it: 'finds common prefix amongst a few words',
            input: [
                'foo',
                'food',
                'foobar',
                'football',
            ],
            expect: 'foo',
        },
        {
            it: 'finds common prefix amongst package paths',
            input: [
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
            expect: 'packages/',
        },
        {
            it: 'returns empty string when no common prefixes exist',
            input: [
                'foo',
                'food',
                'grape',
                'foobar',
                'football',
            ],
            expect: '',
        },
    ]);
});
