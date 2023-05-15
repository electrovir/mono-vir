import {dirname, join} from 'path';

export const monoVirRepoRootPath = dirname(dirname(__dirname));

const testFilesDirPath = join(monoVirRepoRootPath, 'test-files');

export const testRepos = {
    'augment-vir': join(testFilesDirPath, 'augment-vir'),
};
