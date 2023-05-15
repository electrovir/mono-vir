import {parseJson} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node-js';

export type NpmPackage = {
    dirRelativePath: string;
    npmName: string;
    allDeps: string[];
};

export async function getNpmPackages(cwd: string): Promise<NpmPackage[]> {
    const queryOutput = await runShellCommand('npm query .workspace', {
        cwd,
        rejectOnError: true,
    });

    const parsedWorkspaces = parseJson<Partial<Record<string, any>>[]>({
        jsonString: queryOutput.stdout,
        errorHandler() {
            throw new Error(`Failed to read npm workspace data for '${cwd}'`);
        },
    });

    return parsedWorkspaces.map((workspaceEntry): NpmPackage => {
        const allDeps: NpmPackage['allDeps'] = [
            Object.keys(workspaceEntry.devDependencies || {}),
            Object.keys(workspaceEntry.dependencies || {}),
        ].flat();

        return {
            allDeps,
            dirRelativePath: workspaceEntry.location,
            npmName: workspaceEntry.name,
        };
    });
}
