import * as graph from "../src";
import { Graph } from "../src";
import { Option } from "fp-ts/Option";
import * as option from "fp-ts/Option";
import { flow, pipe } from "fp-ts/function";
import { eqNumber } from "fp-ts/lib/Eq";
import { MyEdge, MyId, MyNode } from "./types";

// With this we can define a customized Graph type

type MyGraph = Graph<MyId, MyEdge, MyNode>;

// To save some wrting, we define partially applied versions of the builder functions

const empty = graph.empty<MyId, MyEdge, MyNode>();
const insertNode = graph.insertNode(eqNumber);
const insertEdge = graph.insertEdge(eqNumber);

// Then, let's fill the graph with Data.

export const myGraph: Option<MyGraph> = pipe(
  // We start out with and empty graph.
  empty,

  // And add some nodes to it.
  insertNode(1001, {
    firstName: "Tonicha",
    lastName: "Crowther",
    age: 45,
  }),
  insertNode(1002, {
    firstName: "Samual",
    lastName: "Sierra",
    age: 29,
  }),
  insertNode(1003, {
    firstName: "Khushi",
    lastName: "Walter",
    age: 40,
  }),
  insertNode(1004, {
    firstName: "Rian",
    lastName: "Ruiz",
    age: 56,
  }),

  // Then we connect them with edges, which can have data, too

  option.of,
  option.chain(insertEdge(1001, 1002, { items: [2, 3] })),
  option.chain(insertEdge(1002, 1003, { items: [4] })),
  option.chain(insertEdge(1001, 1003, { items: [9, 4, 3] })),
  option.chain(insertEdge(1003, 1004, { items: [2, 3] }))
);
