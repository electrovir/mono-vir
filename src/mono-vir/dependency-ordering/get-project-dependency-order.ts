import {cruise} from 'dependency-cruiser';
import {join, relative, resolve} from 'path/posix';
import {getProjects} from './get-project-names';
import {createFlattenedTree} from './string-tree/string-tree';

export async function getProjectDependencyOrder(cwd: string): Promise<string[]> {
    const projects = await getProjects(cwd);
    const projectDirPaths = projects.map((project) => join(cwd, project.dirRelativePath));
    const projectDirPathSet = new Set(projectDirPaths);
    const projectsByDirName = Object.fromEntries(
        projects.map((project) => [
            project.dirRelativePath,
            project,
        ]),
    );

    const projectNpmNames = projects.map((project) => project.npmName);
    const projectNpmNameSet = new Set(projectNpmNames);
    const projectsByNpmName = Object.fromEntries(
        projects.map((project) => [
            project.npmName,
            project,
        ]),
    );

    const projectDependencies = cruise(projectDirPaths, {
        doNotFollow: {
            // don't follow anything
            dependencyTypes: [
                'aliased',
                'core',
                'deprecated',
                'local',
                'localmodule',
                'npm',
                'npm-bundled',
                'npm-dev',
                'npm-no-pkg',
                'npm-optional',
                'npm-peer',
                'npm-unknown',
                'undetermined',
                'unknown',
                'type-only',
            ],
        },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            extensions: [
                '.ts',
                '.tsx',
            ],
        },
        moduleSystems: ['es6'],
    });

    if (typeof projectDependencies.output === 'string') {
        throw new Error(`Internal error: failed to get dependencies`);
    }

    const relevantDeps: {[npmName: string]: Set<string>} = Object.fromEntries(
        projectNpmNames.map((projectNpmName) => [
            projectNpmName,
            new Set<string>(),
        ]),
    );
    projectDependencies.output.modules.forEach((moduleEntry) => {
        const fullSourcePath = resolve(moduleEntry.source);
        const relevantProjectPath = findRelevantProject(projectDirPaths, fullSourcePath);

        if (relevantProjectPath) {
            const relativeProjectPath = relative(cwd, relevantProjectPath);
            const relevantProject = projectsByDirName[relativeProjectPath];
            if (!relevantProject) {
                throw new Error(`Failed to find project by relative path '${relativeProjectPath}'`);
            }
            const moduleProjectNpmName = relevantProject.npmName;
            moduleEntry.dependencies.forEach((dep) => {
                if (projectNpmNameSet.has(dep.module)) {
                    relevantDeps[moduleProjectNpmName]!.add(dep.module);
                }
            });
        }
    });

    const treeMatrix = createFlattenedTree(relevantDeps);
    const flattenedDeps = treeMatrix.flat();

    const depsByDirName = flattenedDeps.map(
        (npmName) => projectsByNpmName[npmName]!.dirRelativePath,
    );
    return depsByDirName;
}

function findRelevantProject(
    projectFullPaths: ReadonlyArray<string>,
    modulePath: string,
): string | undefined {
    const relevantProjectPath = projectFullPaths.find(
        (projectFullPath) => !relative(projectFullPath, modulePath).startsWith('.'),
    );

    return relevantProjectPath;
}
