import {mapObjectValues} from '@augment-vir/common';
import {toPosixPath} from '@augment-vir/node';
import {monoVirPackageName} from '../../package-names.js';
import {getNpmPackages, type NpmPackage} from './get-npm-packages.js';
import {createFlattenedTree} from './string-tree/string-tree.js';

/**
 * Get a list of npm mono-repo packages (workspaces) in order based on how they depend on each
 * other.
 */
export async function getRelativePosixPackagePathsInDependencyOrder(
    cwd: string,
): Promise<string[]> {
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

    const flattenedDeps = createFlattenedTree(npmDepsByPackageName).flat();

    const depsByDirName = flattenedDeps.map((npmName) => {
        const npmPackage = npmPackagesByName[npmName];

        if (!npmPackage) {
            throw new Error(`Failed to find package by name '${npmName}'`);
        }

        return toPosixPath(npmPackage.dirRelativePath);
    });

    if (!depsByDirName.length) {
        throw new Error(
            `${monoVirPackageName} found no packages. Be sure that you are using the 'workspaces' package.json field and that you have run 'npm i' recently.`,
        );
    }

    return depsByDirName;
}
