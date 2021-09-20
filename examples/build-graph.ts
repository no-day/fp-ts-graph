import * as G from '../src';
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
  insertNode('TC', {
    firstName: 'Tonicha',
    lastName: 'Crowther',
    age: 45,
  }),
  insertNode('SS', {
    firstName: 'Samual',
    lastName: 'Sierra',
    age: 29,
  }),
  insertNode('KW', {
    firstName: 'Khushi',
    lastName: 'Walter',
    age: 40,
  }),
  insertNode('RR', {
    firstName: 'Rian',
    lastName: 'Ruiz',
    age: 56,
  }),

  // Then we connect them with edges, which can have data, too

  O.of,
  O.chain(insertEdge('TC', 'SS', { items: [2, 3] })),
  O.chain(insertEdge('SS', 'KW', { items: [4] })),
  O.chain(insertEdge('TC', 'KW', { items: [9, 4, 3] })),
  O.chain(insertEdge('KW', 'RR', { items: [2, 3] }))
);
