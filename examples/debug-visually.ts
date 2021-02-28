import * as graph from "@no-day/fp-ts-graph";
import * as option from "fp-ts/Option";
import { flow, pipe } from "fp-ts/function";

// We import our graph from the previous section
import { myGraph } from "./build-graph";

pipe(
  myGraph,

  // We need to map over the graph as it may be invalid
  option.map(
    flow(
      // Then turn the edges into strings
      graph.mapEdges(({ items }) => items.join(", ")),

      // The same we do with the nodes
      graph.map(
        ({ firstName, lastName, age }) => `${lastName}, ${firstName} (${age})`
      ),

      // For debugging, we generate a simple dot file
      graph.toDotFile(_ => _.toString())
    )
  ),

  // Depending on if the graph was valid
  option.fold(
    // We either print an erroe
    () => console.error("invalid graph!"),

    // Or output the dot file
    console.log
  )
);
