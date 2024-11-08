import {queryNpmWorkspace} from '@augment-vir/node';

/** Npm package properties relevant for mono-vir functionality. */
export type NpmPackage = {
    dirRelativePath: string;
    npmName: string;
    allDeps: string[];
};

/** Get a list of npm mono-repo packages (workspaces). */
export async function getNpmPackages(
    /** The directory to query npm from inside of. */
    cwd: string,
): Promise<NpmPackage[]> {
    const workspaceResults = await queryNpmWorkspace(cwd);

    return workspaceResults.map((workspaceEntry): NpmPackage => {
        const allDeps: NpmPackage['allDeps'] = [
            Object.keys(workspaceEntry.devDependencies || {}),
            Object.keys(workspaceEntry.dependencies || {}),
            Object.keys(workspaceEntry.peerDependencies || {}),
        ].flat();

        if (!workspaceEntry.name) {
            throw new Error(`Workspace at '${workspaceEntry.location}' has no name!`);
        }

        return {
            allDeps,
            dirRelativePath: workspaceEntry.location,
            npmName: workspaceEntry.name,
        };
    });
}
