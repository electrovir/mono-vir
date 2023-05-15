import {mapObjectValues} from '@augment-vir/common';
import {getPackages, NpmPackage} from './get-packages';
import {createFlattenedTree} from './string-tree/string-tree';

export async function getPackageDependencyOrder(cwd: string): Promise<string[]> {
    const npmPackagesArray = await getPackages(cwd);
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

        return npmPackage.dirRelativePath;
    });

    return depsByDirName;
}
