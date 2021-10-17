import { Either } from 'fp-ts/Either';
import { Config, Graph } from 'Graph/type';
import { Error } from 'Graph/Error';
import { Ids } from 'Graph';

export type EdgeEntry<E, I extends Ids> = {
  from: I['node'];
  to: I['node'];
  data: E;
};

export type Entries<N, E, I extends Ids> = {
  nodes: [I['node'], Node][];
  edges: [I['edge'], EdgeEntry<E, I>][];
};

export const fromEntries =
  <C extends Config>(config: Cfg) =>
  <N, E, I extends Ids>(
    entries: Entries<N, E, I>
  ): Either<Error, Graph<N, E, C, I>> =>
    'TODO' as any;

export const toEntries = <C extends Config, I extends Ids, E, N>(
  graph: Graph<N, E, C, I>
): Entries<N, E, I> => 'TODO' as any;
