/** @since 0.1.0 */

import { pipe as G } from 'fp-ts/function';
import * as M from 'fp-ts/Map';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import * as S from 'fp-ts/Set';
import { Eq, struct } from 'fp-ts/Eq';

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

/**
 * Graph data structure. Currently we still expose the internal implementation
 * but those details may become opaque in the future.
 *
 * - Id means `Id` of a node,
 * - `Node` is the data/label attached to a node
 * - `Edge` is the data/label attached to a an edge
 *
 * @since 0.1.0
 * @category Model
 */
export interface Graph<Id, Edge, Node> {
  readonly _brand: unique symbol;
  readonly nodes: Map<Id, NodeContext<Id, Node>>;
  readonly edges: Map<Direction<Id>, Edge>;
}

export {
  /**
   * @since 0.1.0
   * @category Model
   */
  Graph as default,
};

/**
 * A general type that describes a directed connection from an origin to a target
 *
 * @since 0.1.0
 * @category Model
 */
export type Direction<T> = { from: T; to: T };

type NodeContext<Id, Node> = {
  data: Node;
  outgoing: Set<Id>;
  incoming: Set<Id>;
};

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

/**
 * Creates an empty graph.
 *
 * @since 0.1.0
 * @category Constructors
 * @example
 *   import Graph, * as G from '@no-day/fp-ts-graph';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   // `G.empty()` will give you a `Graph<unknown, unknown, unknown>` and as you'll
 *   // insert nodes and edges of a specific type later, it makes sense to already
 *   // provide the types.
 *
 *   const myGraph: MyGraph = G.empty();
 */
export const empty = <Id, Edge, Node>(): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: new Map(),
    edges: new Map(),
  });

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

/**
 * Inserts node data to a graph under a given id. If the id already exists in
 * the graph, the data is replaced.
 *
 * @since 0.1.0
 * @category Combinators
 * @example
 *   import * as G from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import * as N from 'fp-ts/number';
 *
 *   const myGraph = pipe(
 *     G.empty<number, unknown, string>(),
 *     G.insertNode(N.Eq)(54, 'n1'),
 *     G.insertNode(N.Eq)(3, 'n2')
 *   );
 *
 *   assert.deepStrictEqual(pipe(myGraph, G.entries), {
 *     nodes: [
 *       [54, 'n1'],
 *       [3, 'n2'],
 *     ],
 *     edges: [],
 *   });
 */
export const insertNode =
  <Id>(E: Eq<Id>) =>
  <Node>(id: Id, data: Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Graph<Id, Edge, Node> =>
    unsafeMkGraph({
      nodes: G(
        graph.nodes,
        M.modifyAt(E)(id, ({ incoming, outgoing }) => ({
          incoming,
          outgoing,
          data,
        })),
        O.getOrElse(() =>
          G(
            graph.nodes,
            M.upsertAt(E)(id, {
              data,
              incoming: S.empty as Set<Id>,
              outgoing: S.empty as Set<Id>,
            })
          )
        )
      ),
      edges: graph.edges,
    });

/**
 * Tries to insert an edge with some data into a given graph. Only succeeds if
 * the specified start and end node id do exists in the graph.
 *
 * @since 0.1.0
 * @category Combinators
 * @example
 *   import Graph, * as G from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import * as O from 'fp-ts/Option';
 *   import * as S from 'fp-ts/string';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(S.Eq)('n1', 'Node 1'),
 *     G.insertNode(S.Eq)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(
 *       myGraph,
 *       G.insertEdge(S.Eq)('n1', 'n2', 'Edge 1'),
 *       O.map(G.entries)
 *     ),
 *     O.some({
 *       nodes: [
 *         ['n1', 'Node 1'],
 *         ['n2', 'Node 2'],
 *       ],
 *       edges: [[{ from: 'n1', to: 'n2' }, 'Edge 1']],
 *     })
 *   );
 */
export const insertEdge =
  <Id>(E: Eq<Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    G(
      graph.nodes,
      modifyEdgeInNodes(E)(from, to),
      O.map((nodes) =>
        unsafeMkGraph({
          nodes,
          edges: insertEdgeInEdges(E)(from, to, data)(graph.edges),
        })
      )
    );

/**
 * Maps over the graph's edges
 *
 * @since 0.1.0
 * @category Combinators
 */
export const mapEdge =
  <Edge1, Edge2>(fn: (edge: Edge1) => Edge2) =>
  <Id, Node>(graph: Graph<Id, Edge1, Node>): Graph<Id, Edge2, Node> =>
    unsafeMkGraph({
      nodes: graph.nodes,
      edges: G(graph.edges, M.map(fn)),
    });

/**
 * Maps over the graph's nodes.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const mapNode =
  <Node1, Node2>(fn: (node: Node1) => Node2) =>
  <Id, Edge>(graph: Graph<Id, Edge, Node1>): Graph<Id, Edge, Node2> =>
    unsafeMkGraph({
      nodes: G(
        graph.nodes,
        M.map(({ incoming, outgoing, data }) => ({
          incoming,
          outgoing,
          data: fn(data),
        }))
      ),
      edges: graph.edges,
    });

/**
 * Alias for `mapNode`.
 *
 * @since 0.1.0
 * @category Combinators
 */
export const map = mapNode;

/**
 * Modifies a single edge in the graph.
 *
 * @since 0.2.0
 * @category Combinators
 */
export const modifyAtEdge =
  <Id>(E: Eq<Id>) =>
  <Edge>(from: Id, to: Id, update: (e: Edge) => Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    G(
      graph.edges,
      M.modifyAt(getEqEdgeId(E))({ from, to }, update),
      O.map((edges) => unsafeMkGraph({ nodes: graph.nodes, edges }))
    );

/**
 * Modifies a single node in the graph.
 *
 * @since 0.2.0
 * @category Combinators
 */
export const modifyAtNode =
  <Id>(E: Eq<Id>) =>
  <Node>(id: Id, update: (n: Node) => Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    G(
      graph.nodes,
      M.modifyAt(E)(id, ({ incoming, outgoing, data }) => ({
        incoming,
        outgoing,
        data: update(data),
      })),
      O.map((nodes) => unsafeMkGraph({ nodes, edges: graph.edges }))
    );

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

/**
 * Retrieves an edge from the graph.
 *
 * @since 0.2.0
 * @category Utils
 * @example
 *   import Graph, * as G from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import * as S from 'fp-ts/string';
 *   import * as O from 'fp-ts/Option';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(S.Eq)('n1', 'Node 1'),
 *     G.insertNode(S.Eq)('n2', 'Node 2'),
 *     O.of,
 *     O.chain(G.insertEdge(S.Eq)('n1', 'n2', 'Edge 1')),
 *     O.getOrElse(() => G.empty<string, string, string>())
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(myGraph, G.lookupEdge(S.Eq)('n1', 'n2')),
 *     O.some('Edge 1')
 *   );
 */
export const lookupEdge =
  <Id>(E: Eq<Id>) =>
  (from: Id, to: Id) =>
  <Edge>(graph: Graph<Id, Edge, unknown>): Option<Edge> =>
    G(graph.edges, M.lookup(getEqEdgeId(E))({ from, to }));

/**
 * Retrieves a node from the graph.
 *
 * @since 0.2.0
 * @category Utils
 * @example
 *   import Graph, * as G from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import * as S from 'fp-ts/string';
 *   import * as O from 'fp-ts/Option';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(S.Eq)('n1', 'Node 1'),
 *     G.insertNode(S.Eq)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(myGraph, G.lookupNode(S.Eq)('n2')),
 *     O.some('Node 2')
 *   );
 */
export const lookupNode =
  <Id>(E: Eq<Id>) =>
  (id: Id) =>
  <Node>(graph: Graph<Id, unknown, Node>): Option<Node> =>
    G(
      graph.nodes,
      M.lookup(E)(id),
      O.map((node) => node.data)
    );

// -----------------------------------------------------------------------------
// destructors
// -----------------------------------------------------------------------------

/**
 * Get nodes as "id"-"value" pairs
 *
 * @since 0.1.0
 * @category Destructors
 */
export const nodeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [Id, Node][] =>
  G(
    graph.nodes,
    M.map((_) => _.data),
    mapEntries
  );

/**
 * Get edges as "edge id"-"value" pairs. As currently multi-edges are not
 * supported, we use node connections as edge ids.
 *
 * @since 0.1.0
 * @category Destructors
 */
export const edgeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [Direction<Id>, Edge][] => G(graph.edges, mapEntries);

/**
 * @since 0.1.0
 * @category Destructors
 */
export const entries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): { nodes: [Id, Node][]; edges: [Direction<Id>, Edge][] } => ({
  nodes: nodeEntries(graph),
  edges: edgeEntries(graph),
});

// -----------------------------------------------------------------------------
// debug
// -----------------------------------------------------------------------------

/**
 * For debugging purpose we provide a simple and dependency free dot file
 * generator as its sort of the standard CLI tool to layout graphs visually. See
 * [graphviz](https://graphviz.org) for more details.
 *
 * If your your edges and nodes are not of type string, you can use `mapEdge`
 * and `mapNode` to convert them. That's not possible with the id, as it would
 * possible change the structure of the graph, thus you need to provide a
 * function that stringifies the ids.
 *
 * @since 0.1.0
 * @category Debug
 */
export const toDotFile =
  <Id>(printId: (id: Id) => string) =>
  (graph: Graph<Id, string, string>): string =>
    G(
      [
        ...G(
          nodeEntries(graph),
          A.map(([id, label]) => `"${printId(id)}" [label="${label}"]`)
        ),
        ...G(
          edgeEntries(graph),
          A.map(
            ([{ from, to }, label]) =>
              `"${printId(from)}" -> "${printId(to)}" [label="${label}"]`
          )
        ),
      ],
      (_) => ['digraph {', ..._, '}'],
      (_) => _.join('\n')
    );

// -----------------------------------------------------------------------------
// instances
// -----------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Instances
 */
export const getEqEdgeId = <Id>(E: Eq<Id>): Eq<Direction<Id>> =>
  struct({ from: E, to: E });

// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, '_brand'>
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;

const mapEntries = <K, V>(map_: Map<K, V>): [K, V][] =>
  G(
    map_,
    (_) => _.entries(),
    Array.from,
    (_) => _ as [K, V][]
  );

const insertIncoming =
  <Id>(E: Eq<Id>) =>
  (from: Id) =>
  <Node>(nodeContext: NodeContext<Id, Node>): NodeContext<Id, Node> => ({
    data: nodeContext.data,
    outgoing: nodeContext.outgoing,
    incoming: G(nodeContext.incoming, S.insert(E)(from)),
  });

const insertOutgoing =
  <Id>(E: Eq<Id>) =>
  (from: Id) =>
  <Node>(nodeContext: NodeContext<Id, Node>): NodeContext<Id, Node> => ({
    data: nodeContext.data,
    outgoing: G(nodeContext.outgoing, S.insert(E)(from)),
    incoming: nodeContext.outgoing,
  });

const modifyEdgeInNodes =
  <Id>(E: Eq<Id>) =>
  (from: Id, to: Id) =>
  <Node>(
    nodes: Graph<Id, unknown, Node>['nodes']
  ): Option<Graph<Id, unknown, Node>['nodes']> =>
    G(
      nodes,
      M.modifyAt(E)(from, insertOutgoing(E)(to)),
      O.chain(M.modifyAt(E)(to, insertIncoming(E)(from)))
    );

const insertEdgeInEdges =
  <Id>(E: Eq<Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  (
    edges: Graph<Id, Edge, unknown>['edges']
  ): Graph<Id, Edge, unknown>['edges'] =>
    G(edges, M.upsertAt(getEqEdgeId(E))({ from, to }, data));
