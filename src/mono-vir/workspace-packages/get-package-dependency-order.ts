import {mapObjectValues} from '@augment-vir/common';
import {toPosixPath} from '@augment-vir/node';
import {monoVirPackageName} from '../../package-names.js';
import {getNpmPackages, type NpmPackage} from './get-npm-packages.js';
import {createDependencyTree} from './string-tree/string-tree.js';

/**
 * Gets a list of non-flattened posix paths for each npm mono-repo package (workspace) in order
 * based on how they depend on each other.
 *
 * @category Internal
 */
export async function getRelativePosixPackagePathTreeInDependencyOrder(
    cwd: string,
): Promise<string[][]> {
    const npmPackagesArray = await getNpmPackages(cwd);
    const npmPackagesByName: Readonly<Record<string, NpmPackage>> = Object.fromEntries(
        npmPackagesArray.map((npmPackage): [string, NpmPackage] => {
            return [
                npmPackage.npmName,
                npmPackage,
            ];
        }),
    );
    const npmDepsByPackageName: Readonly<Record<string, Set<string>>> = mapObjectValues(
        npmPackagesByName,
        (npmPackageName, npmPackage) => {
            const relevantDeps = npmPackage.allDeps.filter(
                (depName) => depName in npmPackagesByName,
            );

            return new Set<string>(relevantDeps);
        },
    );

    const depsTree = createDependencyTree(npmDepsByPackageName);

    const depsByDirName = depsTree.map((layer) => {
        return layer.map((npmName) => {
            const npmPackage = npmPackagesByName[npmName];

            if (!npmPackage) {
                throw new Error(`Failed to find package by name '${npmName}'`);
            }

            return toPosixPath(npmPackage.dirRelativePath);
        });
    });

    if (!depsByDirName.length) {
        throw new Error(
            `${monoVirPackageName} found no packages. Be sure that you are using the 'workspaces' package.json field and that you have run 'npm i' recently.`,
        );
    }

    return depsByDirName;
}

/**
 * Gets a list of flattened posix paths for each npm mono-repo package (workspace) in order based on
 * how they depend on each other.
 *
 * @category Internal
 */
export async function getRelativePosixPackagePathsInDependencyOrder(
    cwd: string,
): Promise<string[]> {
    return (await getRelativePosixPackagePathTreeInDependencyOrder(cwd)).flat();
}
