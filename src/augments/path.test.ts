import {itCases} from '@augment-vir/chai';
import {findLongestCommentPath} from './path';

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
