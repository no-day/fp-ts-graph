# fp-ts-graph

Immutable, functional graph data structure for [fp-ts](https://github.com/gcanti/fp-ts).

```ts
type Graph<Id, Edge, Node> = ...
```

| Quality        | y/n |
| -------------- | --- |
| directed       | yes |
| cyclic         | yes |
| multiple edges | no  |

In the future a granular distinction of graph qualities may be supported, see roadmap.

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What it's not](#what-its-not)
- [Install](#install)
- [Docs](#docs)
- [Examples](#examples)
  - [Define Types](#define-types)
  - [Build Graph](#build-graph)
  - [Debug graph visually](#debug-graph-visually)
- [Roadmap / to do](#roadmap--to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What it is

## What it's not

A rendering engine or anything that has to do with a visual representation of a graph. However, for for debugging purpose we provide simple graphviz dotfile generator.

## Install

```bash
npm install fp-ts @no-day/fp-ts-graph
```

## Docs

[API Docs](https://no-day.github.io/fp-ts-graph/modules/index.ts.html)

## Examples

### Define Types

```ts
import * as G from 'Graph';
import { Graph } from 'Graph';
import { Either } from 'fp-ts/Either';

const config = {
  directed: true,
  multiEdge: false,
  cyclic: false,
};

type Id = number;

type Node = { firstName: string; lastName: string; age: number };

type Edge = { items: number[] };

type Config = typeof config;

export type MyGraph = Graph<Config, Id, Edge, Node>;

export const myGraph: Either<G.Error, MyGraph> = G.fromEntries(config)({
  nodes: [
    [1001, { firstName: 'Tonicha', lastName: 'Crowther', age: 45 }],
    [1002, { firstName: 'Samual', lastName: 'Sierra', age: 29 }],
    [1003, { firstName: 'Khushi', lastName: 'Walter', age: 40 }],
    [1004, { firstName: 'Rian', lastName: 'Ruiz', age: 56 }],
  ],
  edges: [
    [0, { from: 1001, to: 1002, data: { items: [2, 3] } }],
    [1, { from: 1002, to: 1003, data: { items: [4] } }],
    [2, { from: 1001, to: 1003, data: { items: [9, 4, 3] } }],
    [3, { from: 1003, to: 1004, data: { items: [2, 3] } }],
  ],
});
```

### Debug graph visually

```ts
...
```

If you have [graphviz](https://graphviz.org) installed you can run the following in the terminal:

```bash
ts-node examples/debug-visually.ts | dot -Tsvg > graph.svg
chromium graph.svg
```

<img src="./graph.svg"/>

## Roadmap / to do

- Add instances
  - `Functor`
  - `Eq`
  - `Ord`
  - `Foldable`
  - ...
- Add functions
  - `deleteNode`
  - `deleteEdge`
  - `outgoingIds`
  - `incomingIds`
  - `mapEdgeWithIndex`
  - `mapWithIndex`
  - `topologicalSort`
  - ...
- Ideas
  - Represent different qualities of a graph on the type level
    Like: `Graph<{directed: true, multiEdge: true, cyclic: false}, Id, Edge, Node>`
