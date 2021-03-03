import * as graph from '../src';
import * as fp from 'fp-ts';

// We import our graph from the previous section
import { myGraph } from './build-graph';

fp.function.pipe(
  myGraph,

  // We need to map over the graph as it may be invalid
  fp.option.map(
    fp.function.flow(
      // Then turn the edges into strings
      graph.mapEdge(({ items }) => items.join(', ')),

      // The same we do with the nodes
      graph.map(
        ({ firstName, lastName, age }) => `${lastName}, ${firstName} (${age})`
      ),

      // For debugging, we generate a simple dot file
      graph.toDotFile((_) => _.toString())
    )
  ),

  // Depending on if the graph was valid
  fp.option.fold(
    // We either print an erroe
    () => console.error('invalid graph!'),

    // Or output the dot file
    console.log
  )
);
