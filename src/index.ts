/** @since 0.1.0 */

import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { Codec } from 'io-ts/Codec';
import { Decoder } from 'io-ts/Decoder';
import { Encoder } from 'io-ts/Encoder';
import { Map, Set } from 'immutable';
import * as IM from './ImmutableMap';

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
 * - `nodes` key is encoded `Id` to `string` using 'io-ts/Encoder'
 * - `edges` outer key is encoded from node `Id`, inner `Map` key is encoded to node `Id`
 *
 * @since 0.1.0
 * @category Model
 */
export interface Graph<Id, Edge, Node> {
  readonly _brand: unique symbol;
  readonly nodes: Map<string, NodeContext<Node>>;
  readonly edges: Map<string, Map<string, Edge>>;
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

type NodeContext<Node> = {
  data: Node;
  outgoing: Set<string>;
  incoming: Set<string>;
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
    nodes: Map<string, NodeContext<Node>>(),
    edges: Map<string, Map<string, Edge>>(),
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
 *   import * as C from 'io-ts/Codec';
 *
 *   const myGraph = pipe(
 *     G.empty<string, unknown, string>(),
 *     G.insertNode(C.string)('54', 'n1'),
 *     G.insertNode(C.string)('3', 'n2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(myGraph, G.nodeEntries(C.string), (ent) => new Set(ent)),
 *     new Set([
 *       ['54', 'n1'],
 *       ['3', 'n2'],
 *     ])
 *   );
 *   assert.deepStrictEqual(pipe(myGraph, G.edgeEntries(C.string)), []);
 */
export const insertNode =
  <Id>(E: Encoder<string, Id>) =>
  <Node>(id: Id, data: Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Graph<Id, Edge, Node> =>
    unsafeMkGraph({
      nodes: pipe(
        graph.nodes,
        IM.modifyAt(E)(id, ({ incoming, outgoing }) => ({
          incoming,
          outgoing,
          data,
        })),
        O.getOrElse(() =>
          pipe(
            graph.nodes,
            IM.upsertAt(E)(id, {
              data,
              incoming: Set<string>(),
              outgoing: Set<string>(),
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
 *   import * as C from 'io-ts/Codec';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(C.string)('n1', 'Node 1'),
 *     G.insertNode(C.string)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(
 *       myGraph,
 *       G.insertEdge(C.string)('n1', 'n2', 'Edge 1'),
 *       O.map(G.entries(C.string))
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
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
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
      edges: graph.edges.map((from) => from.map(fn)),
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
      nodes: pipe(
        graph.nodes.map(({ incoming, outgoing, data }) => ({
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
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, update: (e: Edge) => Edge) =>
  <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
      graph.edges,
      IM.lookup(E)(from),
      O.chain(IM.modifyAt(E)(to, update)),
      O.chain((updatedTo) =>
        pipe(
          graph.edges,
          IM.modifyAt(E)(from, () => updatedTo)
        )
      ),
      O.map((edges) => unsafeMkGraph({ nodes: graph.nodes, edges }))
    );

/**
 * Modifies a single node in the graph.
 *
 * @since 0.2.0
 * @category Combinators
 */
export const modifyAtNode =
  <Id>(E: Encoder<string, Id>) =>
  <Node>(id: Id, update: (n: Node) => Node) =>
  <Edge>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
    pipe(
      graph.nodes,
      IM.modifyAt(E)(id, ({ incoming, outgoing, data }) => ({
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
 *   import * as O from 'fp-ts/Option';
 *   import * as C from 'io-ts/Codec';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(C.string)('n1', 'Node 1'),
 *     G.insertNode(C.string)('n2', 'Node 2'),
 *     O.of,
 *     O.chain(G.insertEdge(C.string)('n1', 'n2', 'Edge 1')),
 *     O.getOrElse(() => G.empty<string, string, string>())
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(myGraph, G.lookupEdge(C.string)('n1', 'n2')),
 *     O.some('Edge 1')
 *   );
 */
export const lookupEdge =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id, to: Id) =>
  <Edge>(graph: Graph<Id, Edge, unknown>): Option<Edge> =>
    pipe(graph.edges, IM.lookup(E)(from), O.chain(IM.lookup(E)(to)));

/**
 * Retrieves a node from the graph.
 *
 * @since 0.2.0
 * @category Utils
 * @example
 *   import Graph, * as G from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import * as O from 'fp-ts/Option';
 *   import * as C from 'io-ts/Codec';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     G.empty<string, string, string>(),
 *     G.insertNode(C.string)('n1', 'Node 1'),
 *     G.insertNode(C.string)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(myGraph, G.lookupNode(C.string)('n2')),
 *     O.some('Node 2')
 *   );
 */
export const lookupNode =
  <Id>(E: Encoder<string, Id>) =>
  (id: Id) =>
  <Node>(graph: Graph<Id, unknown, Node>): Option<Node> =>
    pipe(
      graph.nodes,
      IM.lookup(E)(id),
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
export const nodeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <Edge, Node>(graph: Graph<Id, Edge, Node>): [Id, Node][] =>
    pipe(
      graph.nodes.map((_) => _.data),
      mapEntries<Id>(D)
    );

/**
 * Get edges as "edge id"-"value" pairs. As currently multi-edges are not
 * supported, we use node connections as edge ids.
 *
 * @since 0.1.0
 * @category Destructors
 */
export const edgeEntries =
  <Id>(D: Decoder<string, Id>) =>
  <Edge, Node>(graph: Graph<Id, Edge, Node>): [Direction<Id>, Edge][] =>
    pipe(
      graph.edges.toArray(),
      A.chain(([encodedFrom, toMap]) =>
        pipe(
          encodedFrom,
          D.decode,
          E.map((from) =>
            pipe(
              toMap,
              mapEntries(D),
              A.map(([to, edge]) => <[Direction<Id>, Edge]>[{ from, to }, edge])
            )
          ),
          E.getOrElse(() => <[Direction<Id>, Edge][]>[])
        )
      )
    );

/**
 * @since 0.1.0
 * @category Destructors
 */
export const entries =
  <Id>(C: Codec<string, string, Id>) =>
  <Edge, Node>(
    graph: Graph<Id, Edge, Node>
  ): { nodes: [Id, Node][]; edges: [Direction<Id>, Edge][] } => ({
    nodes: nodeEntries(C)(graph),
    edges: edgeEntries(C)(graph),
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
  <Id>(D: Decoder<string, Id>) =>
  (printId: (id: Id) => string) =>
  (graph: Graph<Id, string, string>): string =>
    pipe(
      [
        ...pipe(
          nodeEntries(D)(graph),
          A.map(([id, label]) => `"${printId(id)}" [label="${label}"]`)
        ),
        ...pipe(
          edgeEntries(D)(graph),
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
// internal
// -----------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, '_brand'>
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;

const mapEntries =
  <Id>(decoder: Decoder<string, Id>) =>
  <V>(map_: Map<string, V>): [Id, V][] =>
    pipe(
      map_.toArray(),
      A.traverse(E.Applicative)(([encodedKey, value]) =>
        pipe(
          encodedKey,
          decoder.decode,
          E.map((key) => <[Id, V]>[key, value])
        )
      ),
      E.getOrElse(() => <[Id, V][]>[])
    );

const insertIncoming =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id) =>
  <Node>(nodeContext: NodeContext<Node>): NodeContext<Node> => ({
    data: nodeContext.data,
    outgoing: nodeContext.outgoing,
    incoming: nodeContext.incoming.add(E.encode(from)),
  });

const insertOutgoing =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id) =>
  <Node>(nodeContext: NodeContext<Node>): NodeContext<Node> => ({
    data: nodeContext.data,
    outgoing: nodeContext.outgoing.add(E.encode(from)),
    incoming: nodeContext.outgoing,
  });

const modifyEdgeInNodes =
  <Id>(E: Encoder<string, Id>) =>
  (from: Id, to: Id) =>
  <Node>(
    nodes: Graph<Id, unknown, Node>['nodes']
  ): Option<Graph<Id, unknown, Node>['nodes']> =>
    pipe(
      nodes,
      IM.modifyAt(E)(from, insertOutgoing(E)(to)),
      O.chain(IM.modifyAt(E)(to, insertIncoming(E)(from)))
    );

const insertEdgeInEdges =
  <Id>(E: Encoder<string, Id>) =>
  <Edge>(from: Id, to: Id, data: Edge) =>
  (
    edges: Graph<Id, Edge, unknown>['edges']
  ): Graph<Id, Edge, unknown>['edges'] =>
    pipe(
      edges,
      IM.lookup(E)(from),
      O.getOrElse(() => Map<string, Edge>()),
      IM.upsertAt(E)(to, data),
      (toMap) => IM.upsertAt(E)(from, toMap)(edges)
    );
