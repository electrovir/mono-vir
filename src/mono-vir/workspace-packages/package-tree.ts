import {
    addSuffix,
    arrayToObject,
    filterMap,
    mapObjectValues,
    type PartialWithUndefined,
} from '@augment-vir/common';
import {join} from 'node:path';
import {getNpmPackages, type NpmPackage} from './get-npm-packages.js';
import {type PackagesGraph, writeGraphToSvg} from './print-tree.js';
import {createTree, type TreeNode} from './string-tree/string-tree.js';

/**
 * Creates a package tree represented in various formats.
 *
 * @category Internal
 */
export async function createPackageTree(cwd: string, exclude: ReadonlyArray<string> = []) {
    const npmPackagesArray = await getNpmPackages(cwd);
    const packagesByName: Readonly<Record<string, NpmPackage>> = Object.fromEntries(
        filterMap(
            npmPackagesArray,
            (npmPackage): [string, NpmPackage] => {
                return [
                    npmPackage.npmName,
                    npmPackage,
                ];
            },
            ([packageName]) => !exclude.includes(packageName),
        ),
    );
    const npmDepsByPackageName: Readonly<Record<string, Set<string>>> = mapObjectValues(
        packagesByName,
        (npmPackageName, npmPackage) => {
            const relevantDeps = npmPackage.allDeps.filter((depName) => depName in packagesByName);

            return new Set<string>(relevantDeps);
        },
    );

    const packagesTree = createTree(npmDepsByPackageName);

    return {
        packagesTree,
        packagesGraph: createPackagesGraph(packagesTree),
        packagesByName,
    };
}

/**
 * Converts a package tree array to a graph.
 *
 * @category Internal
 */
export function createPackagesGraph(tree: ReadonlyArray<Readonly<TreeNode>>): PackagesGraph {
    if (!tree.length) {
        return {};
    }

    return arrayToObject(
        tree,
        (node) => {
            const childGraph = createPackagesGraph(node.dependents);

            return {
                key: node.value,
                value: childGraph,
            };
        },
        {
            useRequired: true,
        },
    );
}

/**
 * Calculates all internal mono repo package dependencies for the given repo path (`cwd`) and saves
 * it as a direct graph SVG.
 *
 * @category Main
 */
export async function writePackageDepsToFile({
    cwd,
    exclude,
    filePath,
}: {
    cwd: string;
} & PartialWithUndefined<{
    exclude: ReadonlyArray<string>;
    /** Defaults to `join(cwd, 'packages-graph.svg')`. */
    filePath: string;
}>) {
    const {packagesGraph} = await createPackageTree(cwd, exclude);

    const outputFilePath = filePath
        ? addSuffix({value: filePath, suffix: '.svg'})
        : join(cwd, 'packages-graph.svg');

    const svg = await writeGraphToSvg(packagesGraph, outputFilePath);

    return {
        filePath: outputFilePath,
        svg,
    };
}
