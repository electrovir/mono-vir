import {dirname} from 'node:path';
import {findLongestCommonPrefix} from './string.js';

export function findLongestCommentPath(paths: ReadonlyArray<string>): string {
    const longestCommonPrefix = findLongestCommonPrefix(paths);

    if (longestCommonPrefix.endsWith('/')) {
        return longestCommonPrefix;
    } else if (longestCommonPrefix) {
        return dirname(longestCommonPrefix);
    } else {
        return '';
    }
}
