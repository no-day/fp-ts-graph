import * as graph from "../src";
import { Graph } from "../src";
import { Option } from "fp-ts/Option";
import * as option from "fp-ts/Option";
import { flow, pipe } from "fp-ts/function";
import { eqNumber } from "fp-ts/lib/Eq";
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
