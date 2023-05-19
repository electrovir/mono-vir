import {queryNpmWorkspace} from '@augment-vir/node-js';

export type NpmPackage = {
    dirRelativePath: string;
    npmName: string;
    allDeps: string[];
};

export async function getNpmPackages(cwd: string): Promise<NpmPackage[]> {
    const workspaceResults = await queryNpmWorkspace(cwd);

    return workspaceResults.map((workspaceEntry): NpmPackage => {
        const allDeps: NpmPackage['allDeps'] = [
            Object.keys(workspaceEntry.devDependencies || {}),
            Object.keys(workspaceEntry.dependencies || {}),
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
