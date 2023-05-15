import {doNestedAThing} from '@electrovir/nested-a';

export function doTopLevelPackageThing() {
    return 'top level package thing';
}

function main() {
    doNestedAThing();
}
