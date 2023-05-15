import {dirname, join} from 'path';

export const tscMonoRepoRootPath = dirname(dirname(__dirname));

const testFilesDirPath = join(tscMonoRepoRootPath, 'test-files');

export const testRepos = {
    'augment-vir': join(testFilesDirPath, 'augment-vir'),
};
