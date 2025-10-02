import {dirname, join} from 'node:path';

export const monoVirRepoRootPath = dirname(import.meta.dirname);

const testFilesDirPath = join(monoVirRepoRootPath, 'test-files');

export const testRepos = {
    'augment-vir': join(testFilesDirPath, 'augment-vir'),
};

export const exampleGraphFilePath = join(testFilesDirPath, 'graph.svg');
export const testOutputGraphFilePath = join(
    monoVirRepoRootPath,
    '.not-committed',
    'test-graph.svg',
);
