import {readPackageJson, runShellCommand} from '@augment-vir/node-js';
import {existsSync} from 'fs';
import {join} from 'path';
import {TypeScriptNpmProject} from './ts-project';

async function getWorkspacePaths(cwd: string): Promise<string[]> {
    const queryOutput = await runShellCommand('npm query .workspace', {
        cwd,
        rejectOnError: true,
    });

    return (JSON.parse(queryOutput.stdout) as any[]).map((entry) => entry.location);
}

export async function getProjects(cwd: string): Promise<TypeScriptNpmProject[]> {
    const workspacePaths = await getWorkspacePaths(cwd);

    const tsProjectChildPaths = workspacePaths
        .filter((childPath) => {
            return existsSync(join(cwd, childPath, 'tsconfig.json'));
        })
        .sort();

    const projects: TypeScriptNpmProject[] = await Promise.all(
        tsProjectChildPaths.map(async (childPath): Promise<TypeScriptNpmProject> => {
            const projectPath = join(cwd, childPath);
            const packageJson = await readPackageJson(projectPath);
            const packageName = packageJson.name;

            if (!packageName) {
                throw new Error(`Failed to find package.json name for '${projectPath}'`);
            }

            return {
                npmName: packageName,
                dirRelativePath: childPath,
            };
        }),
    );

    return projects;
}
