import * as graph from '../src';
import { deepStrictEqual } from 'assert';
import * as fp from 'fp-ts';

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty graph', () => {
        deepStrictEqual(fp.function.pipe(graph.empty(), graph.entries), {
          nodes: [],
          edges: [],
        });
      });
    });
  });

  describe('Combinators', () => {
    describe('insertNode', () => {
      it('should add a new node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
            graph.entries
          ),
          {
            nodes: [['n1', 'Node 1']],
            edges: [],
          }
        );
      });
    });
  });
});
