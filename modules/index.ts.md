---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [insertEdge](#insertedge)
  - [insertNode](#insertnode)
  - [map](#map)
  - [mapEdge](#mapedge)
  - [mapNode](#mapnode)
  - [modifyAtEdge](#modifyatedge)
  - [modifyAtNode](#modifyatnode)
- [Constructors](#constructors)
  - [empty](#empty)
- [Debug](#debug)
  - [toDotFile](#todotfile)
- [Destructors](#destructors)
  - [edgeEntries](#edgeentries)
  - [entries](#entries)
  - [nodeEntries](#nodeentries)
- [Instances](#instances)
  - [getEqEdgeId](#geteqedgeid)
- [Model](#model)
  - [Direction (type alias)](#direction-type-alias)
  - [Graph (interface)](#graph-interface)
  - [default](#default)
- [Utils](#utils)
  - [lookupEdge](#lookupedge)
  - [lookupNode](#lookupnode)

---

# Combinators

## insertEdge

Tries to insert an edge with some data into a given graph. Only succeeds if
the specified start and end node id do exists in the graph.

**Signature**

```ts
export declare const insertEdge: <Id>(
  E: Eq<Id>
) => <Edge>(
  from: Id,
  to: Id,
  data: Edge
) => <Node>(graph: Graph<Id, Edge, Node>) => option.Option<Graph<Id, Edge, Node>>
```

**Example**

```ts
import Graph, * as graph from '@no-day/fp-ts-graph'
import * as fp from 'fp-ts'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = fp.function.pipe(
  graph.empty<string, string, string>(),
  graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
  graph.insertNode(fp.eq.eqString)('n2', 'Node 2')
)

assert.deepStrictEqual(
  fp.function.pipe(myGraph, graph.insertEdge(fp.eq.eqString)('n1', 'n2', 'Edge 1'), fp.option.map(graph.entries)),
  fp.option.some({
    nodes: [
      ['n1', 'Node 1'],
      ['n2', 'Node 2'],
    ],
    edges: [[{ from: 'n1', to: 'n2' }, 'Edge 1']],
  })
)
```

Added in v0.1.0

## insertNode

Inserts node data to a graph under a given id. If the id already exists in
the graph, the data is replaced.

**Signature**

```ts
export declare const insertNode: <Id>(
  E: Eq<Id>
) => <Node>(id: Id, data: Node) => <Edge>(graph: Graph<Id, Edge, Node>) => Graph<Id, Edge, Node>
```

**Example**

```ts
import * as graph from '@no-day/fp-ts-graph'
import * as fp from 'fp-ts'

const myGraph = fp.function.pipe(
  graph.empty<number, unknown, string>(),
  graph.insertNode(fp.eq.eqNumber)(54, 'n1'),
  graph.insertNode(fp.eq.eqNumber)(3, 'n2')
)

assert.deepStrictEqual(fp.function.pipe(myGraph, graph.entries), {
  nodes: [
    [54, 'n1'],
    [3, 'n2'],
  ],
  edges: [],
})
```

Added in v0.1.0

## map

Alias for `mapNode`.

**Signature**

```ts
export declare const map: <Node1, Node2>(
  fn: (node: Node1) => Node2
) => <Id, Edge>(graph: Graph<Id, Edge, Node1>) => Graph<Id, Edge, Node2>
```

Added in v0.1.0

## mapEdge

Maps over the graph's edges

**Signature**

```ts
export declare const mapEdge: <Edge1, Edge2>(
  fn: (edge: Edge1) => Edge2
) => <Id, Node>(graph: Graph<Id, Edge1, Node>) => Graph<Id, Edge2, Node>
```

Added in v0.1.0

## mapNode

Maps over the graph's nodes.

**Signature**

```ts
export declare const mapNode: <Node1, Node2>(
  fn: (node: Node1) => Node2
) => <Id, Edge>(graph: Graph<Id, Edge, Node1>) => Graph<Id, Edge, Node2>
```

Added in v0.1.0

## modifyAtEdge

Modifies a single edge in the graph.

**Signature**

```ts
export declare const modifyAtEdge: <Id>(
  E: Eq<Id>
) => <Edge>(
  from: Id,
  to: Id,
  update: (e: Edge) => Edge
) => <Node>(graph: Graph<Id, Edge, Node>) => option.Option<Graph<Id, Edge, Node>>
```

Added in v0.2.0

## modifyAtNode

Modifies a single node in the graph.

**Signature**

```ts
export declare const modifyAtNode: <Id>(
  E: Eq<Id>
) => <Node>(
  id: Id,
  update: (n: Node) => Node
) => <Edge>(graph: Graph<Id, Edge, Node>) => option.Option<Graph<Id, Edge, Node>>
```

Added in v0.2.0

# Constructors

## empty

Creates an empty graph.

**Signature**

```ts
export declare const empty: <Id, Edge, Node>() => Graph<Id, Edge, Node>
```

**Example**

```ts
import Graph, * as graph from '@no-day/fp-ts-graph'

type MyGraph = Graph<string, string, string>

// `graph.empty()` will give you a `Graph<unknown, unknown, unknown>` and as you'll
// insert nodes and edges of a specific type later, it makes sense to already
// provide the types.

const myGraph: MyGraph = graph.empty()
```

Added in v0.1.0

# Debug

## toDotFile

For debugging purpose we provide a simple and dependency free dot file
generator as its sort of the standard CLI tool to layout graphs visually. See
[graphviz](https://graphviz.org) for more details.

If your your edges and nodes are not of type string, you can use `mapEdge`
and `mapNode` to convert them. That's not possible with the id, as it would
possible change the structure of the graph, thus you need to provide a
function that stringifies the ids.

**Signature**

```ts
export declare const toDotFile: <Id>(printId: (id: Id) => string) => (graph: Graph<Id, string, string>) => string
```

Added in v0.1.0

# Destructors

## edgeEntries

Get edges as "edge id"-"value" pairs. As currently multi-edges are not
supported, we use node connections as edge ids.

**Signature**

```ts
export declare const edgeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [Direction<Id>, Edge][]
```

Added in v0.1.0

## entries

**Signature**

```ts
export declare const entries: <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
) => { nodes: [Id, Node][]; edges: [Direction<Id>, Edge][] }
```

Added in v0.1.0

## nodeEntries

Get nodes as "id"-"value" pairs

**Signature**

```ts
export declare const nodeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [Id, Node][]
```

Added in v0.1.0

# Instances

## getEqEdgeId

**Signature**

```ts
export declare const getEqEdgeId: <Id>(E: Eq<Id>) => Eq<Direction<Id>>
```

Added in v0.1.0

# Model

## Direction (type alias)

A general type that describes a directed connection from an origin to a target

**Signature**

```ts
export type Direction<T> = { from: T; to: T }
```

Added in v0.1.0

## Graph (interface)

Graph data structure. Currently we still expose the internal implementation
but those details may become opaque in the future.

- Id means `Id` of a node,
- `Node` is the data/label attached to a node
- `Edge` is the data/label attached to a an edge

**Signature**

```ts
export interface Graph<Id, Edge, Node> {
  readonly _brand: unique symbol
  readonly nodes: Map<Id, NodeContext<Id, Node>>
  readonly edges: Map<Direction<Id>, Edge>
}
```

Added in v0.1.0

## default

**Signature**

```ts
export declare const default: any
```

Added in v0.1.0

# Utils

## lookupEdge

Retrieves an edge from the graph.

**Signature**

```ts
export declare const lookupEdge: <Id>(
  E: Eq<Id>
) => (from: Id, to: Id) => <Edge>(graph: Graph<Id, Edge, unknown>) => option.Option<Edge>
```

**Example**

```ts
import Graph, * as graph from '@no-day/fp-ts-graph'
import * as fp from 'fp-ts'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = fp.function.pipe(
  graph.empty<string, string, string>(),
  graph.insertNode(fp.string.Eq)('n1', 'Node 1'),
  graph.insertNode(fp.string.Eq)('n2', 'Node 2'),
  fp.option.of,
  fp.option.chain(graph.insertEdge(fp.string.Eq)('n1', 'n2', 'Edge 1')),
  fp.option.getOrElse(() => graph.empty<string, string, string>())
)

assert.deepStrictEqual(fp.function.pipe(myGraph, graph.lookupEdge(fp.string.Eq)('n1', 'n2')), fp.option.some('Edge 1'))
```

Added in v0.2.0

## lookupNode

Retrieves a node from the graph.

**Signature**

```ts
export declare const lookupNode: <Id>(
  E: Eq<Id>
) => (id: Id) => <Node>(graph: Graph<Id, unknown, Node>) => option.Option<Node>
```

**Example**

```ts
import Graph, * as graph from '@no-day/fp-ts-graph'
import * as fp from 'fp-ts'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = fp.function.pipe(
  graph.empty<string, string, string>(),
  graph.insertNode(fp.string.Eq)('n1', 'Node 1'),
  graph.insertNode(fp.string.Eq)('n2', 'Node 2')
)

assert.deepStrictEqual(fp.function.pipe(myGraph, graph.lookupNode(fp.string.Eq)('n2')), fp.option.some('Node 2'))
```

Added in v0.2.0
