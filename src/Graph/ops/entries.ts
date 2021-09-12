import { Either } from 'fp-ts/Either';
import { Config, Graph } from 'Graph/type';
import { Error } from 'Graph/Error';

export type Entries<Id, Edge, Node> = {
  nodes: [Id, Node][];
  edges: [Id, { from: Id; to: Id; data: Edge }][];
};

export const fromEntries =
  <Cfg extends Config>(config: Cfg) =>
  <Id, Edge, Node>(
    entries: Entries<Id, Edge, Node>
  ): Either<Error, Graph<Cfg, Id, Edge, Node>> =>
    'TODO' as any;

export const toEntries = <Cfg extends Config, Id, Edge, Node>(
  graph: Graph<Cfg, Id, Edge, Node>
): Entries<Id, Edge, Node> => 'TODO' as any;
