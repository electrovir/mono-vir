import {mapObjectValues} from '@augment-vir/common';
import {toPosixPath} from '@augment-vir/node-js';
import {getNpmPackages, NpmPackage} from './get-npm-packages';
import {createFlattenedTree} from './string-tree/string-tree';

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

    return depsByDirName;
}
