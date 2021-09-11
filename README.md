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
// examples/types.ts

import { Graph } from '@no-day/fp-ts-graph';

// First, let's define some custom Id, Edge and Node type for our Graph

export type MyId = number;

export type MyNode = { firstName: string; lastName: string; age: number };

export type MyEdge = { items: number[] };

// Define codec for encoding and decoding Id to string

export const MyIdCodec: Codec<string, string, MyId> = {
  encode: (a: MyId) => a.toString(),
  decode: (i: string) =>
    pipe(
      Number(i),
      E.fromPredicate(
        (parsed: number) => !isNaN(parsed),
        () => Dec.error(i, `${i} is not a number`)
      )
    ),
};

// With this we can define a customized Graph type

export type MyGraph = Graph<MyId, MyEdge, MyNode>;
```

### Build Graph

```ts
// examples/build-graph.ts

import Graph, * as G from '../src';
import * as N from 'fp-ts/number';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';

// We import our types from the previous section
import { MyEdge, MyId, MyNode, MyGraph, MyIdCodec } from './types';

// To save some writing, we define partially applied versions of the builder functions

const empty = G.empty<MyId, MyEdge, MyNode>();
const insertNode = G.insertNode(MyIdCodec);
const insertEdge = G.insertEdge(MyIdCodec);

// Then, let's fill the graph with Data.

export const myGraph: Option<MyGraph> = pipe(
  // We start out with and empty graph.
  empty,

  // And add some nodes to it.
  insertNode(1001, {
    firstName: 'Tonicha',
    lastName: 'Crowther',
    age: 45,
  }),
  insertNode(1002, {
    firstName: 'Samual',
    lastName: 'Sierra',
    age: 29,
  }),
  insertNode(1003, {
    firstName: 'Khushi',
    lastName: 'Walter',
    age: 40,
  }),
  insertNode(1004, {
    firstName: 'Rian',
    lastName: 'Ruiz',
    age: 56,
  }),

  // Then we connect them with edges, which can have data, too

  O.of,
  O.chain(insertEdge(1001, 1002, { items: [2, 3] })),
  O.chain(insertEdge(1002, 1003, { items: [4] })),
  O.chain(insertEdge(1001, 1003, { items: [9, 4, 3] })),
  O.chain(insertEdge(1003, 1004, { items: [2, 3] }))
);
```

### Debug graph visually

```ts
// examples/debug-visually.ts

import * as G from '../src';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';

// We import our graph from the previous section
import { myGraph } from './build-graph';

// We import Id codec
import { MyIdCodec } from './types';


pipe(
  myGraph,

  // We need to map over the graph as it may be invalid
  O.map(
    flow(
      // Then turn the edges into strings
      G.mapEdge(({ items }) => items.join(', ')),

      // The same we do with the nodes
      G.map(
        ({ firstName, lastName, age }) => `${lastName}, ${firstName} (${age})`
      ),

      // For debugging, we generate a simple dot file
      G.toDotFile(MyIdCodec)((_) => _.toString())
    )
  ),

  // Depending on if the graph was valid
  O.fold(
    // We either print an error
    () => console.error('invalid graph!'),

    // Or output the dot file
    console.log
  )
);
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
