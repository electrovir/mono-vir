import {
    addSuffix,
    arrayToObject,
    filterMap,
    mapObjectValues,
    type PartialWithUndefined,
} from '@augment-vir/common';
import {PackageJsonDependencyKey} from '@augment-vir/node';
import {join} from 'node:path';
import {getNpmPackages, type NpmPackage} from './get-npm-packages.js';
import {writeGraphToSvg, type PackagesGraph} from './print-tree.js';
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
            (
                npmPackage,
            ): [
                string,
                NpmPackage,
            ] => {
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
    const allDependenciesByPackage = computeAllTransitiveDependencies(
        packagesByName,
        npmDepsByPackageName,
    );

    return {
        packagesTree,
        packagesGraph: createPackagesGraph(packagesTree),
        packagesByName,
        /**
         * All direct and transitive inter-workspace dependencies for each package, grouped by
         * dependency type.
         */
        allDependenciesByPackage,
    };
}

const dependencyKeysForAllDependencies: PackageJsonDependencyKey[] = [
    PackageJsonDependencyKey.Dependencies,
    PackageJsonDependencyKey.DevDependencies,
    PackageJsonDependencyKey.PeerDependencies,
] as const;

/** All transitive dependencies for a package, grouped by dependency type. */
export type AllDependenciesByType = PartialWithUndefined<
    Record<PackageJsonDependencyKey, string[]>
>;

/**
 * Computes all direct and transitive inter-workspace dependencies for each package, grouped by
 * dependency type.
 *
 * @category Internal
 */
export function computeAllTransitiveDependencies(
    packagesByName: Readonly<Record<string, NpmPackage>>,
    directDeps: Readonly<Record<string, ReadonlySet<string>>>,
): Record<string, AllDependenciesByType> {
    const cache = new Map<string, Set<string>>();

    function getAllDeps(packageName: string, visited: Set<string>): Set<string> {
        const cached = cache.get(packageName);
        if (cached) {
            return cached;
        } else if (visited.has(packageName)) {
            /** Circular dependency detected. */
            return new Set<string>();
        }

        visited.add(packageName);

        const directDependencies = directDeps[packageName] ?? new Set<string>();
        const allDeps = new Set<string>(directDependencies);

        directDependencies.forEach((dep) => {
            const transitiveDeps = getAllDeps(dep, visited);
            transitiveDeps.forEach((transitiveDep) => {
                allDeps.add(transitiveDep);
            });
        });

        cache.set(packageName, allDeps);
        return allDeps;
    }

    return mapObjectValues(directDeps, (packageName) => {
        const allTransitiveDeps = getAllDeps(packageName, new Set<string>());
        const npmPackage = packagesByName[packageName];

        if (!npmPackage) {
            return {};
        }

        const effectiveTypes = computeEffectiveDepTypes(
            npmPackage,
            allTransitiveDeps,
            packagesByName,
        );

        const result: Record<PackageJsonDependencyKey, string[]> = {
            [PackageJsonDependencyKey.Dependencies]: [],
            [PackageJsonDependencyKey.DevDependencies]: [],
            [PackageJsonDependencyKey.PeerDependencies]: [],
            [PackageJsonDependencyKey.Overrides]: [],
        };

        allTransitiveDeps.forEach((dep) => {
            const depType = effectiveTypes[dep] ?? PackageJsonDependencyKey.DevDependencies;
            result[depType].push(dep);
        });

        /** Sort each array for consistent output and filter out empty arrays. */
        return Object.fromEntries(
            dependencyKeysForAllDependencies
                .map(
                    (
                        depType,
                    ): [
                        PackageJsonDependencyKey,
                        string[],
                    ] => [
                        depType,
                        result[depType].toSorted(),
                    ],
                )
                .filter(
                    ([
                        ,
                        deps,
                    ]) => deps.length > 0,
                ),
        );
    });
}

const depTypeStrength: Readonly<Record<PackageJsonDependencyKey, number>> = {
    [PackageJsonDependencyKey.Dependencies]: 2,
    [PackageJsonDependencyKey.PeerDependencies]: 1,
    [PackageJsonDependencyKey.DevDependencies]: 0,
    [PackageJsonDependencyKey.Overrides]: -1,
};

// eslint-disable-next-line @virmator/prefer-params-object
function weakerDepType(
    a: PackageJsonDependencyKey,
    b: PackageJsonDependencyKey,
): PackageJsonDependencyKey {
    return depTypeStrength[a] <= depTypeStrength[b] ? a : b;
}

/**
 * Computes the effective dep type for each transitive dependency using a BFS that propagates the
 * weakest link in the chain. For example, if A depends on B (dep) and B devDepends on C, then C is
 * effectively a devDep of A because the weakest link (B→C) is a devDep.
 *
 * If multiple paths exist, the strongest (most production-like) path wins.
 */
function computeEffectiveDepTypes(
    rootPackage: NpmPackage,
    allTransitiveDeps: ReadonlySet<string>,
    packagesByName: Readonly<Record<string, NpmPackage>>,
): Readonly<Record<string, PackageJsonDependencyKey>> {
    const effectiveTypes: Record<string, PackageJsonDependencyKey> = {};

    /** Seed with direct deps of the root package. */
    dependencyKeysForAllDependencies.forEach((depType) => {
        (rootPackage.depsByType[depType] ?? [])
            .filter((dep) => allTransitiveDeps.has(dep))
            .forEach((dep) => {
                const current = effectiveTypes[dep];

                if (!current || depTypeStrength[depType] > depTypeStrength[current]) {
                    effectiveTypes[dep] = depType;
                }
            });
    });

    /** BFS to propagate through transitive deps using the weakest link in each chain. */
    const queue = Object.keys(effectiveTypes);

    while (queue.length > 0) {
        const current = queue.shift();

        if (!current) {
            break;
        }

        const currentType = effectiveTypes[current];

        if (!currentType) {
            continue;
        }

        const pkg = packagesByName[current];

        if (!pkg) {
            continue;
        }

        dependencyKeysForAllDependencies.forEach((depType) => {
            (pkg.depsByType[depType] ?? []).forEach((dep) => {
                if (!allTransitiveDeps.has(dep)) {
                    return;
                }
                const effective = weakerDepType(currentType, depType);
                const existing = effectiveTypes[dep];

                if (!existing || depTypeStrength[effective] > depTypeStrength[existing]) {
                    effectiveTypes[dep] = effective;
                    queue.push(dep);
                }
            });
        });
    }

    return effectiveTypes;
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
        ? addSuffix({
              value: filePath,
              suffix: '.svg',
          })
        : join(cwd, 'packages-graph.svg');

    const svg = await writeGraphToSvg(packagesGraph, outputFilePath);

    return {
        filePath: outputFilePath,
        svg,
    };
}
