import Graph, * as G from '../src';
import * as N from 'fp-ts/number';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';

// We import our types from the previous section
import { MyEdge, MyId, MyNode, MyGraph } from './types';

// To save some writing, we define partially applied versions of the builder functions

const empty = G.empty<MyId, MyEdge, MyNode>();
const insertNode = G.insertNode(N.Eq);
const insertEdge = G.insertEdge(N.Eq);

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
