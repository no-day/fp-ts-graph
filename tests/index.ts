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
      it('should add new nodes', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
            graph.insertNode(fp.eq.eqString)('n2', 'Node 2'),
            graph.entries
          ),
          {
            nodes: [
              ['n1', 'Node 1'],
              ['n2', 'Node 2'],
            ],
            edges: [],
          }
        );
      });

      it('should update an existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
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

  describe('insertEdge', () => {
    it('should insert an edge between existing nodes', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
          graph.insertNode(fp.eq.eqString)('n2', 'Node 2'),
          graph.insertEdge(fp.eq.eqString)('n1', 'n2', 'Edge 1'),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [
            ['n1', 'Node 1'],
            ['n2', 'Node 2'],
          ],
          edges: [[{ from: 'n1', to: 'n2' }, 'Edge 1']],
        })
      );
    });

    it('should insert an edge from a node to itself', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
          graph.insertEdge(fp.eq.eqString)('n1', 'n1', 'Edge 1'),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [['n1', 'Node 1']],
          edges: [[{ from: 'n1', to: 'n1' }, 'Edge 1']],
        })
      );
    });

    it('should not insert and edge to a non existent node', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(fp.eq.eqString)('n1', 'Node 1'),
          graph.insertEdge(fp.eq.eqString)('n1', 'n2', 'Edge 1'),
          fp.option.map(graph.entries)
        ),
        fp.option.none
      );
    });
  });
});
