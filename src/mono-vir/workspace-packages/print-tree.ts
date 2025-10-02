import {assert} from '@augment-vir/assert';
import {wrapString} from '@augment-vir/common';
import {writeFileAndDir} from '@augment-vir/node';
import {instance} from '@viz-js/viz';

/**
 * Keys are package names, packages with no dependencies have an empty object as their value: `{}`.
 *
 * @category Internal
 */
export type PackagesGraph = {[PackageName in string]: PackagesGraph};

/** Wraps the value in double quotes and escapes all internal double quotes. */
function quote(value: string): string {
    return wrapString({
        value: value.replace(/"/g, String.raw`\"`),
        wrapper: '"',
    });
}

const graphTitle = 'A depends on → B';

function toDot(graph: Readonly<PackagesGraph>): string {
    const nodes = new Set<string>();
    /** Store as "from\0to" to dedupe */
    const edges = new Set<string>();
    /** Guard repeated traversals / cycles. */
    const seenPair = new Set<string>();

    function walk(consumer: string, innerGraph: Readonly<PackagesGraph>, stack: Set<string>) {
        Object.entries(innerGraph).forEach(
            ([
                key,
                value,
            ]) => {
                nodes.add(consumer);
                nodes.add(key);

                /** Invert: A depends on B ==> B -> A. */
                edges.add(`${key}\0${consumer}`);

                const pair = `${consumer}\0${key}`;
                if (!seenPair.has(pair) && !stack.has(key)) {
                    seenPair.add(pair);
                    stack.add(key);
                    walk(key, value, stack);
                    stack.delete(key);
                }
            },
        );
    }

    Object.entries(graph).forEach(
        ([
            key,
            value,
        ]) => {
            nodes.add(key);
            walk(key, value, new Set([key]));
        },
    );

    const nodeLines = Array.from(nodes).map((node) => `${quote(node)} [label=${quote(node)}];`);
    const edgeLines = Array.from(edges).map((edge) => {
        const [
            from,
            to,
        ] = edge.split('\0');

        assert.isString(from, `Failed to extract edge "from" from ${edge}`);
        assert.isString(to, `Failed to extract edge "to" from ${edge}`);

        return [
            quote(from),
            quote(to),
        ].join(' -> ');
    });

    // cspell:word arrowsize,labelloc,rankdir
    return `
digraph G {
  graph [rankdir=LR, labelloc="t", label=${quote(graphTitle)}, fontsize=18];
  node  [shape=box, style="rounded,filled", fillcolor="#f8f9fb", fontsize=11];
  edge  [arrowhead=vee, arrowsize=0.7];
  ${nodeLines.join('\n  ')}
  ${edgeLines.join('\n  ')}
}
`.trim();
}

/**
 * Writes the dependency graph to an SVG file.
 *
 * @internal
 */
export async function writeGraphToSvg(
    graph: Readonly<PackagesGraph>,
    filePath: string,
): Promise<string> {
    const dot = toDot(graph);
    const viz = await instance();

    const svg = viz.renderString(dot, {format: 'svg', engine: 'dot'});
    await writeFileAndDir(filePath, svg);

    return svg;
}
