import {describe, itCases} from '@augment-vir/test';
import {createFlattenedTree} from './string-tree.js';

describe(createFlattenedTree.name, () => {
    itCases(createFlattenedTree, [
        {
            it: 'creates a flattened tree from a valid dep set',
            input: {
                '@augment-vir/browser': new Set([
                    '@augment-vir/common',
                    '@augment-vir/browser-testing',
                ]),
                '@augment-vir/browser-testing': new Set([
                    '@augment-vir/testing',
                    '@augment-vir/common',
                ]),
                '@augment-vir/chai': new Set([
                    '@augment-vir/testing',
                    '@augment-vir/common',
                ]),
                '@augment-vir/common': new Set<string>(),
                '@augment-vir/common-tests': new Set([
                    '@augment-vir/chai',
                    '@augment-vir/testing',
                    '@augment-vir/node-js',
                ]),
                '@augment-vir/docker': new Set([
                    '@augment-vir/node-js',
                    '@augment-vir/common',
                ]),
                '@augment-vir/element-vir': new Set([
                    '@augment-vir/browser-testing',
                    '@augment-vir/common',
                ]),
                '@augment-vir/node-js': new Set([
                    '@augment-vir/chai',
                    '@augment-vir/common',
                ]),
                '@augment-vir/prisma-node-js': new Set([
                    '@augment-vir/node-js',
                ]),
                '@augment-vir/scripts': new Set([
                    '@augment-vir/common',
                    '@augment-vir/node-js',
                ]),
                '@augment-vir/testing': new Set([
                    '@augment-vir/common',
                ]),
            },
            expect: [
                [
                    '@augment-vir/common',
                ],
                [
                    '@augment-vir/testing',
                ],
                [
                    '@augment-vir/browser-testing',
                    '@augment-vir/chai',
                ],
                [
                    '@augment-vir/browser',
                    '@augment-vir/element-vir',
                    '@augment-vir/node-js',
                ],
                [
                    '@augment-vir/common-tests',
                    '@augment-vir/docker',
                    '@augment-vir/prisma-node-js',
                    '@augment-vir/scripts',
                ],
            ],
        },
        {
            it: 'errors on a tree with circular deps between non-root nodes',
            input: {
                '@my-app/app-backend': new Set(['@my-app/common-universal']),
                '@my-app/app-frontend': new Set([]),
                '@my-app/another-another-frontend': new Set([]),
                '@my-app/common-backend': new Set([]),
                '@my-app/common-universal': new Set(['@my-app/app-backend']),
                '@my-app/another-backend': new Set(['@my-app/another-common']),
                '@my-app/another-common': new Set([]),
                '@my-app/another-frontend': new Set([]),
                '@my-app/another-scripts': new Set([]),
                '@my-app/services': new Set(['@my-app/common-universal']),
            },
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'fails on a circular tree',
            input: {
                grandparent: new Set([]),
                child: new Set([
                    'grandparent',
                    'fry',
                ]),
                fry: new Set(['child']),
            },
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'works with just some root nodes',
            input: {
                one: new Set([]),
                two: new Set([]),
                three: new Set([]),
            },
            expect: [
                [
                    'one',
                    'two',
                    'three',
                ],
            ],
        },
        {
            it: 'works with multiple root nodes and a tree',
            input: {
                top: new Set([]),
                top2: new Set([]),
                middle: new Set(['top']),
                middleShared: new Set([
                    'top',
                    'top2',
                ]),
                dependsOnEverything: new Set([
                    'top',
                    'top2',
                    'middle',
                    'middleShared',
                ]),
            },
            expect: [
                [
                    'top',
                    'top2',
                ],
                [
                    'middle',
                    'middleShared',
                ],
                [
                    'dependsOnEverything',
                ],
            ],
        },
    ]);
});
