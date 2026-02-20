import {type PartialWithUndefined} from '@augment-vir/common';
import {PackageJsonDependencyKey, queryNpmWorkspace} from '@augment-vir/node';

/** Dependencies grouped by their type. */
export type DependenciesByType = PartialWithUndefined<Record<PackageJsonDependencyKey, string[]>>;

/** Npm package properties relevant for mono-vir functionality. */
export type NpmPackage = {
    dirRelativePath: string;
    npmName: string;
    allDeps: string[];
    depsByType: DependenciesByType;
};

/** Get a list of npm mono-repo packages (workspaces). */
export async function getNpmPackages(
    /** The directory to query npm from inside of. */
    cwd: string,
): Promise<NpmPackage[]> {
    const workspaceResults = await queryNpmWorkspace(cwd);

    return workspaceResults.map((workspaceEntry): NpmPackage => {
        const fullDepsByType: Record<PackageJsonDependencyKey, string[]> = {
            [PackageJsonDependencyKey.Dependencies]: Object.keys(workspaceEntry.dependencies || {}),
            [PackageJsonDependencyKey.DevDependencies]: Object.keys(
                workspaceEntry.devDependencies || {},
            ),
            [PackageJsonDependencyKey.PeerDependencies]: Object.keys(
                workspaceEntry.peerDependencies || {},
            ),
            [PackageJsonDependencyKey.Overrides]: Object.keys(workspaceEntry.overrides || {}),
        };

        const allDeps: NpmPackage['allDeps'] = [
            fullDepsByType[PackageJsonDependencyKey.DevDependencies],
            fullDepsByType[PackageJsonDependencyKey.Dependencies],
            fullDepsByType[PackageJsonDependencyKey.PeerDependencies],
        ].flat();

        const depsByType: DependenciesByType = Object.fromEntries(
            Object.entries(fullDepsByType).filter(
                ([
                    ,
                    deps,
                ]) => deps.length > 0,
            ),
        );

        if (!workspaceEntry.name) {
            throw new Error(`Workspace at '${workspaceEntry.location}' has no name!`);
        }

        return {
            allDeps,
            depsByType,
            dirRelativePath: workspaceEntry.location,
            npmName: workspaceEntry.name,
        };
    });
}
