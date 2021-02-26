---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [insertEdge](#insertedge)
  - [insertNode](#insertnode)
  - [map](#map)
  - [mapEdges](#mapedges)
- [constructors](#constructors)
  - [empty](#empty)
- [debug](#debug)
  - [toDotFile](#todotfile)
- [destructors](#destructors)
  - [edgeEntries](#edgeentries)
  - [nodeEntries](#nodeentries)
- [instances](#instances)
  - [getEqEdgeId](#geteqedgeid)
- [model](#model)
  - [Graph (type alias)](#graph-type-alias)

---

# combinators

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

Added in v0.1.0

## insertNode

**Signature**

```ts
export declare const insertNode: <Id>(
  E: Eq<Id>
) => <Node>(id: Id, data: Node) => <Edge>(graph: Graph<Id, Edge, Node>) => Graph<Id, Edge, Node>
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

# constructors

## empty

**Signature**

```ts
export declare const empty: <Id, Edge, Node>() => Graph<Id, Edge, Node>
```

Added in v0.1.0

# debug

## toDotFile

**Signature**

```ts
export declare const toDotFile: <Id>(printId: (id: Id) => string) => (graph: Graph<Id, string, string>) => string
```

Added in v0.1.0

# destructors

## edgeEntries

**Signature**

```ts
export declare const edgeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [EdgeId<Id>, Edge][]
```

Added in v0.1.0

## nodeEntries

**Signature**

```ts
export declare const nodeEntries: <Id, Edge, Node>(graph: Graph<Id, Edge, Node>) => [Id, Node][]
```

Added in v0.1.0

# instances

## getEqEdgeId

**Signature**

```ts
export declare const getEqEdgeId: <Id>(E: Eq<Id>) => Eq<EdgeId<Id>>
```

Added in v0.1.0

# model

## Graph (type alias)

**Signature**

```ts
export type Graph<Id, Edge, Node> = {
  readonly _brand: unique symbol
  readonly nodes: Map<Id, NodeContext<Id, Node>>
  readonly edges: Map<EdgeId<Id>, Edge>
}
```

Added in v0.1.0
