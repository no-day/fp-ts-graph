import * as G from 'Graph';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';

// // We import our graph from the previous section
// import { myGraph } from './build-graph';

// pipe(
//   myGraph,

//   // We need to map over the graph as it may be invalid
//   O.map(
//     flow(
//       // Then turn the edges into strings
//       G.mapEdge(({ items }) => items.join(', ')),

//       // The same we do with the nodes
//       G.map(
//         ({ firstName, lastName, age }) => `${lastName}, ${firstName} (${age})`
//       ),

//       // For debugging, we generate a simple dot file
//       G.toDotFile((_) => _.toString())
//     )
//   ),

//   // Depending on if the graph was valid
//   O.fold(
//     // We either print an error
//     () => console.error('invalid graph!'),

//     // Or output the dot file
//     console.log
//   )
// );
