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

export type MyGraph = Graph<Config, Id, Edge, Node>

export const myGraph: Either<G.Error, MyGraph> = G.fromEntries(
  config
)({
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
