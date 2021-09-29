import * as graph from '../src';
import { deepStrictEqual } from 'assert';
import * as fp from 'fp-ts';
import * as Codec from 'io-ts/Codec';

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty graph', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.entries(Codec.string)
          ),
          {
            nodes: [],
            edges: [],
          }
        );
      });
    });
  });

  describe('Combinators', () => {
    describe('insertNode', () => {
      it('should add new nodes', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            graph.entries(Codec.string)
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
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.entries(Codec.string)
          ),
          {
            nodes: [['n1', 'Node 1']],
            edges: [],
          }
        );
      });
    });

    describe('modifyAtEdge', () => {
      it('should modify an existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            fp.option.of,
            fp.option.chain(
              graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')
            ),
            fp.option.chain(
              graph.modifyAtEdge(Codec.string)(
                'n1',
                'n2',
                (e) => `${e} updated`
              )
            ),
            fp.option.map(graph.edgeEntries(Codec.string))
          ),
          fp.option.some([[{ from: 'n1', to: 'n2' }, 'Edge 1 updated']])
        );
      });

      it('should not modify a non-existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            fp.option.of,
            fp.option.chain(
              graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')
            ),
            fp.option.chain(
              graph.modifyAtEdge(Codec.string)(
                'n2',
                'n1',
                (e) => `${e} updated`
              )
            ),
            fp.option.map(graph.edgeEntries(Codec.string))
          ),
          fp.option.none
        );
      });
    });

    describe('modifyAtNode', () => {
      it('should modify an existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            graph.modifyAtNode(Codec.string)('n2', (n) => `${n} updated`),
            fp.option.map(graph.nodeEntries(Codec.string))
          ),
          fp.option.some([
            ['n1', 'Node 1'],
            ['n2', 'Node 2 updated'],
          ])
        );
      });

      it("shouldn't modify a non-existing node", () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            graph.modifyAtNode(Codec.string)('n3', (n) => `${n} updated`),
            fp.option.map(graph.nodeEntries(Codec.string))
          ),
          fp.option.none
        );
      });
    });
  });

  describe('insertEdge', () => {
    it('should insert an edge between existing nodes', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1'),
          fp.option.map(graph.entries(Codec.string))
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

    it('should insert an edges in both directions between two nodes', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.chain(graph.insertEdge(Codec.string)('n2', 'n1', 'Edge 2')),
          fp.option.map(graph.entries(Codec.string))
        ),
        fp.option.some({
          nodes: [
            ['n1', 'Node 1'],
            ['n2', 'Node 2'],
          ],
          edges: [
            [{ from: 'n1', to: 'n2' }, 'Edge 1'],
            [{ from: 'n2', to: 'n1' }, 'Edge 2'],
          ],
        })
      );
    });

    it('should insert an edge from a node to itself', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertEdge(Codec.string)('n1', 'n1', 'Edge 1'),
          fp.option.map(graph.entries(Codec.string))
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
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1'),
          fp.option.map(graph.entries(Codec.string))
        ),
        fp.option.none
      );
    });

    it('prevents regression of incorrect incoming nodes', () =>
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertNode(Codec.string)('n3', 'Node 3'),
          graph.insertNode(Codec.string)('n4', 'Node 4'),
          graph.insertNode(Codec.string)('n5', 'Node 5'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n3', 'n1', 'Edge 1')),
          fp.option.chain(graph.insertEdge(Codec.string)('n3', 'n2', 'Edge 2')),
          fp.option.chain(graph.insertEdge(Codec.string)('n4', 'n3', 'Edge 3')),
          fp.option.chain(graph.insertEdge(Codec.string)('n5', 'n3', 'Edge 3')),
          fp.option.chain((g) =>
            fp.function.pipe(
              g.nodes.get(Codec.string.encode('n3'), null),
              fp.option.fromNullable
            )
          ),
          fp.option.map((node) => ({
            data: node.data,
            incoming: node.incoming.toArray().sort(),
            outgoing: node.outgoing.toArray().sort(),
          }))
        ),
        fp.option.of({
          data: 'Node 3',
          incoming: ['n4', 'n5'],
          outgoing: ['n1', 'n2'],
        })
      ));
  });

  describe('mapEdge', () => {
    it("should map edge's type and values", () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, number, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertNode(Codec.string)('n3', 'Node 3'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 1)),
          fp.option.chain(graph.insertEdge(Codec.string)('n2', 'n3', 2)),
          fp.option.map(graph.mapEdge((n) => `Edge ${n}`)),
          fp.option.map(graph.entries(Codec.string))
        ),
        fp.option.some({
          nodes: [
            ['n1', 'Node 1'],
            ['n2', 'Node 2'],
            ['n3', 'Node 3'],
          ],
          edges: [
            [{ from: 'n1', to: 'n2' }, 'Edge 1'],
            [{ from: 'n2', to: 'n3' }, 'Edge 2'],
          ],
        })
      );
    });
  });

  describe('mapNode', () => {
    it("should map nodes's type and values", () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, number>(),
          graph.insertNode(Codec.string)('n1', 1),
          graph.insertNode(Codec.string)('n2', 2),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.map(graph.mapNode((n) => `Node ${n}`)),
          fp.option.map(graph.entries(Codec.string))
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
  });

  describe('nodeEntries', () => {
    it('should return all node entries (ids and values)', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.map(graph.nodeEntries(Codec.string))
        ),
        fp.option.some([
          ['n1', 'Node 1'],
          ['n2', 'Node 2'],
        ])
      );
    });
  });

  describe('edgeEntries', () => {
    it('should return all edge entries (edge ids and values)', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertNode(Codec.string)('n3', 'Node 3'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.chain(graph.insertEdge(Codec.string)('n2', 'n3', 'Edge 2')),
          fp.option.map(graph.mapNode((n) => `Node ${n}`)),
          fp.option.map(graph.edgeEntries(Codec.string))
        ),
        fp.option.some([
          [{ from: 'n1', to: 'n2' }, 'Edge 1'],
          [{ from: 'n2', to: 'n3' }, 'Edge 2'],
        ])
      );
    });
  });

  describe('edgeEntries', () => {
    it('should return all node and edge entries', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertNode(Codec.string)('n3', 'Node 3'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.chain(graph.insertEdge(Codec.string)('n2', 'n3', 'Edge 2')),
          fp.option.map(graph.entries(Codec.string))
        ),
        fp.option.some({
          nodes: [
            ['n1', 'Node 1'],
            ['n2', 'Node 2'],
            ['n3', 'Node 3'],
          ],
          edges: [
            [{ from: 'n1', to: 'n2' }, 'Edge 1'],
            [{ from: 'n2', to: 'n3' }, 'Edge 2'],
          ],
        })
      );
    });
  });

  describe('toDotFile', () => {
    it('should generate a valid dot file', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty<string, string, string>(),
          graph.insertNode(Codec.string)('n1', 'Node 1'),
          graph.insertNode(Codec.string)('n2', 'Node 2'),
          graph.insertNode(Codec.string)('n3', 'Node 3'),
          fp.option.of,
          fp.option.chain(graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')),
          fp.option.chain(graph.insertEdge(Codec.string)('n2', 'n3', 'Edge 2')),
          fp.option.map(graph.toDotFile(Codec.string)(fp.function.identity))
        ),
        fp.option.some(`digraph {
"n1" [label="Node 1"]
"n2" [label="Node 2"]
"n3" [label="Node 3"]
"n1" -> "n2" [label="Edge 1"]
"n2" -> "n3" [label="Edge 2"]
}`)
      );
    });
  });

  describe('Utils', () => {
    describe('lookupEdge', () => {
      it('should return an existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            graph.insertNode(Codec.string)('n3', 'Node 3'),
            fp.option.of,
            fp.option.chain(
              graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')
            ),
            fp.option.chain(
              graph.insertEdge(Codec.string)('n2', 'n3', 'Edge 2')
            ),
            fp.option.chain(graph.lookupEdge(Codec.string)('n1', 'n2'))
          ),
          fp.option.some('Edge 1')
        );
      });

      it('should return none for non-existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.insertNode(Codec.string)('n2', 'Node 2'),
            graph.insertNode(Codec.string)('n3', 'Node 3'),
            fp.option.of,
            fp.option.chain(
              graph.insertEdge(Codec.string)('n1', 'n2', 'Edge 1')
            ),
            fp.option.chain(
              graph.insertEdge(Codec.string)('n2', 'n3', 'Edge 2')
            ),
            fp.option.chain(graph.lookupEdge(Codec.string)('n3', 'n2'))
          ),
          fp.option.none
        );
      });
    });

    describe('lookupNode', () => {
      it('should return an existing node value', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.lookupNode(Codec.string)('n1')
          ),
          fp.option.some('Node 1')
        );
      });

      it('should lookup none for non-existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty<string, string, string>(),
            graph.insertNode(Codec.string)('n1', 'Node 1'),
            graph.lookupNode(Codec.string)('n2')
          ),
          fp.option.none
        );
      });
    });
  });
});
