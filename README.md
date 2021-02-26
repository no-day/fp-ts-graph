# fp-ts-graph

Immutable, functional graph data structure for [fp-ts](https://github.com/gcanti/fp-ts).

The graph is directed and cyclic.

## Install

```bash
npm install fp-ts git+https://github.com/no-day/fp-ts-graph
```

## Docs

[API](https://no-day.github.io/fp-ts-graph/modules/index.ts.html)

## Examples

### Define Types

```ts
// examples/types.ts

import { Graph } from "fp-ts-graph";

// First, let's define some custom Id, Edge and Node type for our Graph

export type MyId = number;

export type MyNode = { firstName: string; lastName: string; age: number };

export type MyEdge = { items: number[] };

// With this we can define a customized Graph type

export type MyGraph = Graph<MyId, MyEdge, MyNode>;
```

### Build Graph

```ts
// examples/build-graph.ts

import * as graph from "fp-ts-graph";
import { Graph } from "fp-ts-graph";
import { Option } from "fp-ts/Option";
import * as option from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { eqNumber } from "fp-ts/lib/Eq";
import { MyEdge, MyId, MyNode } from "./types";

// With this we can define a customized Graph type

type MyGraph = Graph<MyId, MyEdge, MyNode>;

// To save some writing, we define partially applied versions of the builder functions

const empty = graph.empty<MyId, MyEdge, MyNode>();
const insertNode = graph.insertNode(eqNumber);
const insertEdge = graph.insertEdge(eqNumber);

// Then, let's fill the graph with Data.

export const myGraph: Option<MyGraph> = pipe(
  // We start out with and empty graph.
  empty,

  // And add some nodes to it.
  insertNode(1001, {
    firstName: "Tonicha",
    lastName: "Crowther",
    age: 45,
  }),
  insertNode(1002, {
    firstName: "Samual",
    lastName: "Sierra",
    age: 29,
  }),
  insertNode(1003, {
    firstName: "Khushi",
    lastName: "Walter",
    age: 40,
  }),
  insertNode(1004, {
    firstName: "Rian",
    lastName: "Ruiz",
    age: 56,
  }),

  // Then we connect them with edges, which can have data, too

  option.of,
  option.chain(insertEdge(1001, 1002, { items: [2, 3] })),
  option.chain(insertEdge(1002, 1003, { items: [4] })),
  option.chain(insertEdge(1001, 1003, { items: [9, 4, 3] })),
  option.chain(insertEdge(1003, 1004, { items: [2, 3] }))
);
```

### Debug graph visually

```ts
// examples/debug-visually.ts

import * as graph from "fp-ts-graph";
import * as option from "fp-ts/Option";
import { flow, pipe } from "fp-ts/function";
import { myGraph } from "./build-graph";

pipe(
  myGraph,

  // We need to map over the graph as it may be invalid
  option.map(
    flow(
      // Then turn the edges into strings
      graph.mapEdges(({ items }) => items.join(", ")),

      // The same we do with the nodes
      graph.map(
        ({ firstName, lastName, age }) => `${lastName}, ${firstName} (${age})`
      ),

      // For debugging, we generate a simple dot file
      graph.toDotFile(_ => _.toString())
    )
  ),

  // Depending if the graph was valid
  option.fold(
    // We either print an error
    () => console.error("invalid graph!"),

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
