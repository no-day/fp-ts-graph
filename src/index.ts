/** @since 0.1.0 */

import { pipe } from 'fp-ts/function';
import * as map_ from 'fp-ts/Map';
import * as array from 'fp-ts/Array';
import * as tuple from 'fp-ts/Tuple';
import * as option from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import * as set_ from 'fp-ts/Set';
import { Eq, eqString, getStructEq } from 'fp-ts/Eq';

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

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
  readonly edges: Map<EdgeId<Id>, Edge>;
}

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
 * Creates an empty graph.
 *
 * @since 0.1.0
 * @category Constructors
 * @example
 *   import * as graph from '@no-day/fp-ts-graph';
 *   import { Graph } from '@no-day/fp-ts-graph';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   // `graph.empty()` will give you a `Graph<unknown, unknown, unknown>` and as you'll
 *   // insert nodes and edges of a specific type later, it makes sense to already
 *   // provide the types.
 *
 *   const myGraph: MyGraph = graph.empty();
 */
export const empty = <Id, Edge, Node>(): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: map_.empty,
    edges: map_.empty,
  });

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Inserts node data to a graph under a given id. If the id already exists in
 * the graph, the data is replaced.
 *
 * @since 0.1.0
 * @category Combinators
 * @example
 *   import * as graph from '@no-day/fp-ts-graph';
 *   import { pipe } from 'fp-ts/function';
 *   import { eqNumber } from 'fp-ts/Eq';
 *
 *   const myGraph = pipe(
 *     graph.empty<number, unknown, string>(),
 *     graph.insertNode(eqNumber)(54, 'n1'),
 *     graph.insertNode(eqNumber)(3, 'n2')
 *   );
 *
 *   assert.deepStrictEqual(pipe(myGraph, graph.entries), {
 *     nodes: [
 *       [54, 'n1'],
 *       [3, 'n2'],
 *     ],
 *     edges: [],
 *   });
 */
export const insertNode = <Id>(E: Eq<Id>) => <Node>(id: Id, data: Node) => <
  Edge
>(
  graph: Graph<Id, Edge, Node>
): Graph<Id, Edge, Node> =>
  unsafeMkGraph({
    nodes: pipe(
      graph.nodes,
      map_.modifyAt(E)(id, ({ incoming, outgoing }) => ({
        incoming,
        outgoing,
        data,
      })),
      option.getOrElse(() =>
        pipe(
          graph.nodes,
          map_.insertAt(E)(id, {
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
 * Tries to insert an edge with some data into a given graph. Only succeeds if
 * the specified start and end node id do exists in the graph.
 *
 * @since 0.1.0
 * @category Combinators
 * @example
 *   // Between different nodes
 *
 *   import * as graph from '@no-day/fp-ts-graph';
 *   import { Graph } from '@no-day/fp-ts-graph';
 *   import * as option from 'fp-ts/Option';
 *   import { Option } from 'fp-ts/Option';
 *   import { pipe } from 'fp-ts/function';
 *   import { eqString } from 'fp-ts/Eq';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     graph.empty<string, string, string>(),
 *     graph.insertNode(eqString)('n1', 'Node 1'),
 *     graph.insertNode(eqString)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(
 *       myGraph,
 *       graph.insertEdge(eqString)('n1', 'n2', 'Edge 1'),
 *       option.map(graph.entries)
 *     ),
 *     option.some({
 *       nodes: [
 *         ['n1', 'Node 1'],
 *         ['n2', 'Node 2'],
 *       ],
 *       edges: [[{ from: 'n1', to: 'n2' }, 'Edge 1']],
 *     })
 *   );
 *
 * @example
 *   // Cycle
 *
 *   import * as graph from '@no-day/fp-ts-graph';
 *   import { Graph } from '@no-day/fp-ts-graph';
 *   import * as option from 'fp-ts/Option';
 *   import { Option } from 'fp-ts/Option';
 *   import { pipe } from 'fp-ts/function';
 *   import { eqString } from 'fp-ts/Eq';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     graph.empty<string, string, string>(),
 *     graph.insertNode(eqString)('n1', 'Node 1'),
 *     graph.insertNode(eqString)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(
 *       myGraph,
 *       graph.insertEdge(eqString)('n1', 'n1', 'Edge 1'),
 *       option.map(graph.entries)
 *     ),
 *     option.some({
 *       nodes: [
 *         ['n1', 'Node 1'],
 *         ['n2', 'Node 2'],
 *       ],
 *       edges: [[{ from: 'n1', to: 'n1' }, 'Edge 1']],
 *     })
 *   );
 *
 * @example
 *   // Invalid
 *
 *   import * as graph from '@no-day/fp-ts-graph';
 *   import { Graph } from '@no-day/fp-ts-graph';
 *   import * as option from 'fp-ts/Option';
 *   import { Option } from 'fp-ts/Option';
 *   import { pipe } from 'fp-ts/function';
 *   import { eqString } from 'fp-ts/Eq';
 *
 *   type MyGraph = Graph<string, string, string>;
 *
 *   const myGraph: MyGraph = pipe(
 *     graph.empty<string, string, string>(),
 *     graph.insertNode(eqString)('n1', 'Node 1'),
 *     graph.insertNode(eqString)('n2', 'Node 2')
 *   );
 *
 *   assert.deepStrictEqual(
 *     pipe(
 *       myGraph,
 *       graph.insertEdge(eqString)('n1', 'n3', 'Edge 1'),
 *       option.map(graph.entries)
 *     ),
 *     option.none
 *   );
 */
export const insertEdge = <Id>(E: Eq<Id>) => <Edge>(
  from: Id,
  to: Id,
  data: Edge
) => <Node>(graph: Graph<Id, Edge, Node>): Option<Graph<Id, Edge, Node>> =>
  pipe(
    graph.nodes,
    modifyEdgeInNodes(E)(from, to),
    option.map((nodes) =>
      unsafeMkGraph({
        nodes,
        edges: insertEdgeInEdges(E)(from, to, data)(graph.edges),
      })
    )
  );

/**
 * @since 0.1.0
 * @category Combinators
 */
export const mapEdges = <Edge1, Edge2>(fn: (edge: Edge1) => Edge2) => <
  Id,
  Node
>(
  graph: Graph<Id, Edge1, Node>
): Graph<Id, Edge2, Node> =>
  unsafeMkGraph({
    nodes: graph.nodes,
    edges: pipe(graph.edges, map_.map(fn)),
  });

/**
 * @since 0.1.0
 * @category Combinators
 */
export const map = <Node1, Node2>(fn: (node: Node1) => Node2) => <Id, Edge>(
  graph: Graph<Id, Edge, Node1>
): Graph<Id, Edge, Node2> =>
  unsafeMkGraph({
    nodes: pipe(
      graph.nodes,
      map_.map(({ incoming, outgoing, data }) => ({
        incoming,
        outgoing,
        data: fn(data),
      }))
    ),
    edges: graph.edges,
  });

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Destructors
 */
export const nodeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [Id, Node][] =>
  pipe(
    graph.nodes,
    map_.map((_) => _.data),
    mapEntries
  );

/**
 * @since 0.1.0
 * @category Destructors
 */
export const edgeEntries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): [EdgeId<Id>, Edge][] => pipe(graph.edges, mapEntries);

/**
 * @since 0.1.0
 * @category Destructors
 */
export const entries = <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
): { nodes: [Id, Node][]; edges: [EdgeId<Id>, Edge][] } => ({
  nodes: nodeEntries(graph),
  edges: edgeEntries(graph),
});

// -------------------------------------------------------------------------------------
// debug
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Debug
 */
export const toDotFile = <Id>(printId: (id: Id) => string) => (
  graph: Graph<Id, string, string>
): string =>
  pipe(
    [
      ...pipe(
        nodeEntries(graph),
        array.map(([id, label]) => `"${printId(id)}" [label="${label}"]`)
      ),
      ...pipe(
        edgeEntries(graph),
        array.map(
          ([{ from, to }, label]) =>
            `"${printId(from)}" -> "${printId(to)}" [label="${label}"]`
        )
      ),
    ],
    (_) => ['digraph {', ..._, '}'],
    (_) => _.join('\n')
  );

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.0
 * @category Instances
 */
export const getEqEdgeId = <Id>(E: Eq<Id>): Eq<EdgeId<Id>> =>
  getStructEq({ from: E, to: E });

// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, '_brand'>
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;

const mapEntries = <K, V>(map_: Map<K, V>): [K, V][] =>
  pipe(
    map_,
    (_) => _.entries(),
    Array.from,
    (_) => _ as [K, V][]
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
  nodes: Graph<Id, unknown, Node>['nodes']
): Option<Graph<Id, unknown, Node>['nodes']> =>
  pipe(
    nodes,
    map_.modifyAt(E)(from, insertOutgoing(E)(to)),
    option.chain(map_.modifyAt(E)(to, insertIncoming(E)(from)))
  );

const insertEdgeInEdges = <Id>(E: Eq<Id>) => <Edge>(
  from: Id,
  to: Id,
  data: Edge
) => (
  edges: Graph<Id, Edge, unknown>['edges']
): Graph<Id, Edge, unknown>['edges'] =>
  pipe(edges, map_.insertAt(getEqEdgeId(E))({ from, to }, data));
