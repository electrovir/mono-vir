import {describe, itCases} from '@augment-vir/test';
import {findLongestCommentPath} from './path.js';

describe(findLongestCommentPath.name, () => {
    itCases(findLongestCommentPath, [
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
