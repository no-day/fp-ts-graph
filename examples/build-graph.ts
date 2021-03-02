import Graph, * as graph from '../src';
import * as fp from 'fp-ts';

// We import our types from the previous section
import { MyEdge, MyId, MyNode, MyGraph } from './types';

// To save some wrting, we define partially applied versions of the builder functions

const empty = graph.empty<MyId, MyEdge, MyNode>();
const insertNode = graph.insertNode(fp.eq.eqNumber);
const insertEdge = graph.insertEdge(fp.eq.eqNumber);

// Then, let's fill the graph with Data.

export const myGraph: fp.option.Option<MyGraph> = fp.function.pipe(
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

  fp.option.of,
  fp.option.chain(insertEdge(1001, 1002, { items: [2, 3] })),
  fp.option.chain(insertEdge(1002, 1003, { items: [4] })),
  fp.option.chain(insertEdge(1001, 1003, { items: [9, 4, 3] })),
  fp.option.chain(insertEdge(1003, 1004, { items: [2, 3] }))
);
