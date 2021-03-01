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
  - [mapEdges](#mapedges)
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
  - [Graph (interface)](#graph-interface)

---

# Combinators

## insertEdge

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
import * as graph from '@no-day/fp-ts-graph'
import { Graph } from '@no-day/fp-ts-graph'
import * as option from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { eqNumber } from 'fp-ts/Eq'

const myGraph: Graph<number, string, string> = pipe(
  graph.empty<number, string, string>(),
  graph.insertNode(eqNumber)(54, 'n1'),
  graph.insertNode(eqNumber)(3, 'n2')
)

// Between different nodes
assert.deepStrictEqual(
  pipe(myGraph, graph.insertEdge(eqNumber)(54, 3, 'e1'), option.map(graph.entries)),
  option.some({
    nodes: [
      [54, 'n1'],
      [3, 'n2'],
    ],
    edges: [[{ from: 54, to: 3 }, 'e1']],
  })
)

// Cycle
assert.deepStrictEqual(
  pipe(myGraph, graph.insertEdge(eqNumber)(3, 3, 'e1'), option.map(graph.entries)),
  option.some({
    nodes: [
      [54, 'n1'],
      [3, 'n2'],
    ],
    edges: [[{ from: 3, to: 3 }, 'e1']],
  })
)

// Invalid
assert.deepStrictEqual(pipe(myGraph, graph.insertEdge(eqNumber)(7, 3, 'e1'), option.map(graph.entries)), option.none)
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
import { pipe } from 'fp-ts/function'
import { eqNumber } from 'fp-ts/Eq'

const myGraph = pipe(
  graph.empty<number, unknown, string>(),
  graph.insertNode(eqNumber)(54, 'n1'),
  graph.insertNode(eqNumber)(3, 'n2')
)

pipe(myGraph, graph.entries, (_) =>
  assert.deepStrictEqual(_, {
    nodes: [
      [54, 'n1'],
      [3, 'n2'],
    ],
    edges: [],
  })
)
```

Added in v0.1.0

## map

**Signature**

```ts
export declare const map: <Node1, Node2>(
  fn: (node: Node1) => Node2
) => <Id, Edge>(graph: Graph<Id, Edge, Node1>) => Graph<Id, Edge, Node2>
```

Added in v0.1.0

## mapEdges

**Signature**

```ts
export declare const mapEdges: <Edge1, Edge2>(
  fn: (edge: Edge1) => Edge2
) => <Id, Node>(graph: Graph<Id, Edge1, Node>) => Graph<Id, Edge2, Node>
```

Added in v0.1.0

# Constructors

## empty

Creates an empty graph.

**Signature**

```ts
export declare const empty: <Id, Edge, Node>() => Graph<Id, Edge, Node>
```

**Example**

```ts
import * as graph from '@no-day/fp-ts-graph'
import { Graph } from '@no-day/fp-ts-graph'

type MyGraph = Graph<string, string, string>

// `graph.empty()` will give you a `Graph<unknown, unknown, unknown>` and as you'll
// insert nodes and edges of a specific type later, it makes sense to already
// provide the types.

const myGraph: MyGraph = graph.empty()
```

Added in v0.1.0

# Debug

## toDotFile

**Signature**

```ts
export declare const toDotFile: <Id>(printId: (id: Id) => string) => (graph: Graph<Id, string, string>) => string
```

Added in v0.1.0

# Destructors

## edgeEntries

**Signature**

```ts
export declare const edgeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [EdgeId<Id>, Edge][]
```

Added in v0.1.0

## entries

**Signature**

```ts
export declare const entries: <Id, Edge, Node>(
  graph: Graph<Id, Edge, Node>
) => { nodes: [Id, Node][]; edges: [EdgeId<Id>, Edge][] }
```

Added in v0.1.0

## nodeEntries

**Signature**

```ts
export declare const nodeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [Id, Node][]
```

Added in v0.1.0

# Instances

## getEqEdgeId

**Signature**

```ts
export declare const getEqEdgeId: <Id>(E: Eq<Id>) => Eq<EdgeId<Id>>
```

Added in v0.1.0

# Model

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
  readonly edges: Map<EdgeId<Id>, Edge>
}
```

Added in v0.1.0
