/**
 * @since 0.1.0
 */

import { pipe } from "fp-ts/function";
import * as map from "fp-ts/Map";
import * as array from "fp-ts/Array";
import * as tuple from "fp-ts/Tuple";
import * as option from "fp-ts/Option";
import { Option } from "fp-ts/Option";
import * as set_ from "fp-ts/Set";
import { Eq, eqString, getStructEq } from "fp-ts/Eq";

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
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.1.0
 */
export const insertNode = <Id, Edge, Node>(E: Eq<Id>) => (
  id: Id,
  data: Node
) => (graph: Graph<Id, Edge, Node>): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: pipe(
      graph.nodes,
      map.modifyAt(E)(id, ({ incoming, outgoing }) => ({
        incoming,
        outgoing,
        data,
      })),
      option.getOrElse(() =>
        pipe(
          graph.nodes,
          map.insertAt(E)(id, {
            data,
            incoming: set_.empty as Set<Id>,
            outgoing: set_.empty as Set<Id>,
          })
        )
      )
    ),
    edges: graph.edges,
  });

/**
 * @category combinators
 * @since 0.1.0
 */
export const insertEdge = <Id>(E: Eq<Id>) => <Node, Edge>(
  from: Id,
  to: Id,
  data: Edge
) => (graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
  pipe(
    graph.nodes,
    modifyEdgeInNodes(E)(from, to),
    option.map(nodes =>
      unsafeMkGraph({
        nodes,
        edges: insertEdgeInEdges(E)(from, to, data)(graph.edges),
      })
    )
  );

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
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 0.1.0
 */
export const getEqEdgeId = <Id>(E: Eq<Id>): Eq<EdgeId<Id>> =>
  getStructEq({ from: E, to: E });

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

const insertIncoming = <Id>(E: Eq<Id>) => (from: Id) => <Node>(
  nodeContext: NodeContext<Id, Node>
): NodeContext<Id, Node> => ({
  data: nodeContext.data,
  outgoing: nodeContext.outgoing,
  incoming: pipe(nodeContext.incoming, set_.insert(E)(from)),
});

const insertOutgoing = <Id>(E: Eq<Id>) => (from: Id) => <Node>(
  nodeContext: NodeContext<Id, Node>
): NodeContext<Id, Node> => ({
  data: nodeContext.data,
  outgoing: pipe(nodeContext.outgoing, set_.insert(E)(from)),
  incoming: nodeContext.outgoing,
});

const modifyEdgeInNodes = <Id>(E: Eq<Id>) => (from: Id, to: Id) => <Node>(
  nodes: Graph<Id, unknown, Node>["nodes"]
): Option<Graph<Id, unknown, Node>["nodes"]> =>
  pipe(
    nodes,
    map.modifyAt(E)(from, insertOutgoing(E)(to)),
    option.chain(map.modifyAt(E)(to, insertIncoming(E)(from)))
  );

const insertEdgeInEdges = <Id>(E: Eq<Id>) => <Edge>(
  from: Id,
  to: Id,
  data: Edge
) => (
  edges: Graph<Id, Edge, unknown>["edges"]
): Graph<Id, Edge, unknown>["edges"] =>
  pipe(edges, map.insertAt(getEqEdgeId(E))({ from, to }, data));
