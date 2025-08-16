import {describe, itCases} from '@augment-vir/test';
import {findLongestCommonPath} from './path.js';

describe(findLongestCommonPath.name, () => {
    itCases(findLongestCommonPath, [
        {
            it: 'finds common path',
            input: [
                '/a/b/c',
                '/a/b/cat',
            ],
            expect: '/a/b',
        },
        {
            it: 'returns empty string if there is no common path',
            input: [
                '/a/b/c',
                '/a/b/cat',
                'q/b/c/',
            ],
            expect: '',
        },
    ]);
});
