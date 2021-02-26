const graph = require("../src");
const { pipe } = require("fp-ts");

pipe(
  graph.empty,
  graph.insertNode(0, { name: "Foo", age: 34 }),
  graph.insertNode(0, { name: "Foo", age: 34 })
);
