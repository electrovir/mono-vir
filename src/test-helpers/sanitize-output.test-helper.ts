import {monoVirRepoRootPath} from './file-paths.test-helper';

export function sanitizeTestOutput(
    originalOutput: string | number | undefined,
): string | number | undefined {
    if (typeof originalOutput === 'string') {
        return originalOutput.replaceAll(monoVirRepoRootPath, './');
    } else {
        return originalOutput;
    }
}
