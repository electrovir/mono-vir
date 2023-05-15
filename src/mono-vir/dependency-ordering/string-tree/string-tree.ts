type TreeNode = {
    value: string;
    // descendants
    dependents: TreeNode[];
    // ancestors
    dependencies: TreeNode[];
};

function createTree(deps: Record<string, Set<string>>): TreeNode[] {
    const rootNodes: TreeNode[] = [];
    const nodesByValue: Record<string, TreeNode> = {};

    function getNode(value: string): TreeNode {
        const existingNode = nodesByValue[value];
        if (existingNode) {
            return existingNode;
        }
        const newNode: TreeNode = {
            value,
            dependencies: [],
            dependents: [],
        };

        nodesByValue[value] = newNode;
        return newNode;
    }

    Object.entries(deps).forEach(
        ([
            nodeValue,
            nodeDeps,
        ]) => {
            const currentTreeNode: TreeNode = getNode(nodeValue);

            if (nodeDeps.size) {
                nodeDeps.forEach((dep) => {
                    const depNode: TreeNode = getNode(dep);
                    depNode.dependents.push(currentTreeNode);
                    currentTreeNode.dependencies.push(depNode);
                });
            } else {
                rootNodes.push(currentTreeNode);
            }
        },
    );

    return rootNodes;
}

function flattenTree(tree: ReadonlyArray<TreeNode>): string[][] {
    const levelsByValue: Record<string, number> = {};

    /**
     * AllDescendants is used to detect and break out of circular dependencies. Otherwise, we'll
     * waste user time by maxing out the call stack.
     */
    const allDescendants: Record<string, Set<string>> = {};

    function addDescendant(parentValue: string, descendantValue: string) {
        if (!allDescendants[parentValue]) {
            allDescendants[parentValue] = new Set();
        }

        if (descendantValue === parentValue) {
            throw new Error(
                `Circular project dependency detected: '${parentValue}' depends on itself.`,
            );
        }

        allDescendants[parentValue]!.add(descendantValue);
    }

    function traverse(node: TreeNode, currentLevel: number, parents: string[]) {
        parents.forEach((parent) => addDescendant(parent, node.value));

        levelsByValue[node.value] = Math.max(levelsByValue[node.value] ?? 0, currentLevel);
        node.dependents.forEach((child) =>
            traverse(child, currentLevel + 1, parents.concat(node.value)),
        );
    }

    tree.forEach((topNode) => traverse(topNode, 0, []));

    const matrix: string[][] = [];

    Object.entries(levelsByValue).forEach(
        ([
            value,
            level,
        ]) => {
            if (!matrix[level]) {
                matrix[level] = [];
            }
            matrix[level]!.push(value);
        },
    );

    return matrix;
}

export function createFlattenedTree(deps: Record<string, Set<string>>): string[][] {
    const tree = createTree(deps);
    return flattenTree(tree);
}
