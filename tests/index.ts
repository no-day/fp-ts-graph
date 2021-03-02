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
});
