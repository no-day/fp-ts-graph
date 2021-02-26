/**
 * @since 0.1.0
 */

import { pipe } from "fp-ts/function";
import * as map from "fp-ts/Map";
import * as array from "fp-ts/Array";
import * as tuple from "fp-ts/Tuple";

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
type Graph<Id, Edge, Node> = {
  readonly _brand: unique symbol;
  readonly nodes: Map<Id, NodeContext<Id, Node>>;
  readonly edges: Map<EdgeId<Id>, Edge>;
};

type NodeContext<Id, Node> = {
  data: Node;
  outgoing: Set<Id>;
  incoming: Set<Id>;
};

type EdgeId<Id> = { from: Id; to: Id };

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const empty = <Id, Edge, Node>(): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: map.empty,
    edges: map.empty,
  });

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @category destructors
 * @since 0.1.0
 */
export const nodeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [Id, Node][] =>
  pipe(
    graph.nodes,
    map.map(_ => _.data),
    mapEntries
  );

/**
 * @category destructors
 * @since 0.1.0
 */
export const edgeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [EdgeId<Id>, Edge][] => pipe(graph.edges, mapEntries);

// -------------------------------------------------------------------------------------
// debug
// -------------------------------------------------------------------------------------

/**
 * @category debug
 * @since 0.1.0
 */
export const toDotFile = (graph: Graph<string, string, string>): string =>
  pipe(
    [
      ...pipe(
        nodeEntries(graph),
        array.map(([id, label]) => `"${id}" [label="${label}"]`)
      ),
      ...pipe(
        edgeEntries(graph),
        array.map(
          ([{ from, to }, label]) => `"${from}" -> "${to}" [label="${label}"]`
        )
      ),
    ],
    _ => ["digraph {", ..._, "}"],
    _ => _.join("\n")
  );

// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, "_brand">
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;

const mapEntries = <K, V>(map_: Map<K, V>): [K, V][] =>
  pipe(
    map_,
    _ => _.entries(),
    Array.from,
    _ => _ as [K, V][]
  );
