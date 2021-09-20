---
title: index.ts
nav_order: 2
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
  E: Encoder<string, Id>
) => <Edge>(from: Id, to: Id, data: Edge) => <Node>(graph: Graph<Id, Edge, Node>) => O.Option<Graph<Id, Edge, Node>>
```

**Example**

```ts
import Graph, * as G from '@no-day/fp-ts-graph'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as C from 'io-ts/Codec'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = pipe(
  G.empty<string, string, string>(),
  G.insertNode(C.string)('n1', 'Node 1'),
  G.insertNode(C.string)('n2', 'Node 2')
)

assert.deepStrictEqual(
  pipe(myGraph, G.insertEdge(C.string)('n1', 'n2', 'Edge 1'), O.map(G.entries(C.string))),
  O.some({
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
  E: Encoder<string, Id>
) => <Node>(id: Id, data: Node) => <Edge>(graph: Graph<Id, Edge, Node>) => Graph<Id, Edge, Node>
```

**Example**

```ts
import * as G from '@no-day/fp-ts-graph'
import { pipe } from 'fp-ts/function'
import * as C from 'io-ts/Codec'

const myGraph = pipe(
  G.empty<string, unknown, string>(),
  G.insertNode(C.string)('54', 'n1'),
  G.insertNode(C.string)('3', 'n2')
)

assert.deepStrictEqual(
  pipe(myGraph, G.nodeEntries(C.string), (ent) => new Set(ent)),
  new Set([
    ['54', 'n1'],
    ['3', 'n2'],
  ])
)
assert.deepStrictEqual(pipe(myGraph, G.edgeEntries(C.string)), [])
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
  E: Encoder<string, Id>
) => <Edge>(
  from: Id,
  to: Id,
  update: (e: Edge) => Edge
) => <Node>(graph: Graph<Id, Edge, Node>) => O.Option<Graph<Id, Edge, Node>>
```

Added in v0.2.0

## modifyAtNode

Modifies a single node in the graph.

**Signature**

```ts
export declare const modifyAtNode: <Id>(
  E: Encoder<string, Id>
) => <Node>(
  id: Id,
  update: (n: Node) => Node
) => <Edge>(graph: Graph<Id, Edge, Node>) => O.Option<Graph<Id, Edge, Node>>
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
import Graph, * as G from '@no-day/fp-ts-graph'

type MyGraph = Graph<string, string, string>

// `G.empty()` will give you a `Graph<unknown, unknown, unknown>` and as you'll
// insert nodes and edges of a specific type later, it makes sense to already
// provide the types.

const myGraph: MyGraph = G.empty()
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
export declare const toDotFile: <Id>(
  D: Decoder<string, Id>
) => (printId: (id: Id) => string) => (graph: Graph<Id, string, string>) => string
```

Added in v0.1.0

# Destructors

## edgeEntries

Get edges as "edge id"-"value" pairs. As currently multi-edges are not
supported, we use node connections as edge ids.

**Signature**

```ts
export declare const edgeEntries: <Id>(
  D: Decoder<string, Id>
) => <Edge, Node>(graph: Graph<Id, Edge, Node>) => [Direction<Id>, Edge][]
```

Added in v0.1.0

## entries

**Signature**

```ts
export declare const entries: <Id>(
  C: Codec<string, string, Id>
) => <Edge, Node>(graph: Graph<Id, Edge, Node>) => { nodes: [Id, Node][]; edges: [Direction<Id>, Edge][] }
```

Added in v0.1.0

## nodeEntries

Get nodes as "id"-"value" pairs

**Signature**

```ts
export declare const nodeEntries: <Id>(
  D: Decoder<string, Id>
) => <Edge, Node>(graph: Graph<Id, Edge, Node>) => [Id, Node][]
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
- `nodes` key is encoded `Id` to `string` using 'io-ts/Encoder'
- `edges` outer key is encoded from node `Id`, inner `Map` key is encoded to node `Id`

**Signature**

```ts
export interface Graph<Id, Edge, Node> {
  readonly _brand: unique symbol
  readonly nodes: Map<string, NodeContext<Node>>
  readonly edges: Map<string, Map<string, Edge>>
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
  E: Encoder<string, Id>
) => (from: Id, to: Id) => <Edge>(graph: Graph<Id, Edge, unknown>) => O.Option<Edge>
```

**Example**

```ts
import Graph, * as G from '@no-day/fp-ts-graph'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as C from 'io-ts/Codec'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = pipe(
  G.empty<string, string, string>(),
  G.insertNode(C.string)('n1', 'Node 1'),
  G.insertNode(C.string)('n2', 'Node 2'),
  O.of,
  O.chain(G.insertEdge(C.string)('n1', 'n2', 'Edge 1')),
  O.getOrElse(() => G.empty<string, string, string>())
)

assert.deepStrictEqual(pipe(myGraph, G.lookupEdge(C.string)('n1', 'n2')), O.some('Edge 1'))
```

Added in v0.2.0

## lookupNode

Retrieves a node from the graph.

**Signature**

```ts
export declare const lookupNode: <Id>(
  E: Encoder<string, Id>
) => (id: Id) => <Node>(graph: Graph<Id, unknown, Node>) => O.Option<Node>
```

**Example**

```ts
import Graph, * as G from '@no-day/fp-ts-graph'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as C from 'io-ts/Codec'

type MyGraph = Graph<string, string, string>

const myGraph: MyGraph = pipe(
  G.empty<string, string, string>(),
  G.insertNode(C.string)('n1', 'Node 1'),
  G.insertNode(C.string)('n2', 'Node 2')
)

assert.deepStrictEqual(pipe(myGraph, G.lookupNode(C.string)('n2')), O.some('Node 2'))
```

Added in v0.2.0
