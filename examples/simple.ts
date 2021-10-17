import * as G from 'Graph';
import { Graph } from 'Graph';
import { Either } from 'fp-ts/Either';

const g = G.create();

export const myGraph: Either<G.Error, Graph> = G.create({
  nodes: ['car', 'dog', 'house', 'snow'],
//   edges: [
//     { from: '1001', to: '1002' },
//     { from: '1002', to: '1003' },
//     { from: '1001', to: '1003' },
//     { from: '1003', to: '1004' },
//   ],
});
