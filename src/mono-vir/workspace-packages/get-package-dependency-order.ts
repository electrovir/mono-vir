import {toPosixPath} from '@augment-vir/node';
import {monoVirPackageName} from '../../package-names.js';
import {createPackageTree} from './package-tree.js';
import {flattenTree} from './string-tree/string-tree.js';

/**
 * Gets a list of non-flattened posix paths for each npm mono-repo package (workspace) in order
 * based on how they depend on each other.
 *
 * @category Internal
 */
export async function getRelativePosixPackagePathTreeInDependencyOrder(
    cwd: string,
    exclude: string[] = [],
): Promise<string[][]> {
    const {packagesByName, packagesTree} = await createPackageTree(cwd, exclude);
    const depsTree = flattenTree(packagesTree);

    const depsByDirName = depsTree.map((layer) => {
        return layer.map((npmName) => {
            const npmPackage = packagesByName[npmName];

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
    exclude: string[] = [],
): Promise<string[]> {
    return (await getRelativePosixPackagePathTreeInDependencyOrder(cwd, exclude)).flat();
}
