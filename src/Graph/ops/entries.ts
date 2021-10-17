import { Either } from 'fp-ts/Either';
import { Config, Graph } from 'Graph/type';
import { Error } from 'Graph/Error';
import { DefaultConfig, Ids } from 'Graph';

export type EdgeEntry<E, I extends Ids> = {
  from: I['node'];
  to: I['node'];
  data: E;
};

type Entry<K, V> = V extends unknown ? K : [K, V];

export type Entries<N, E, I extends Ids> = {
  nodes?: Entry<I['node'], Node>[];
  //edges: [I['edge'], EdgeEntry<E, I>][];
};

export const defaultConfig: DefaultConfig = {
  cyclic: false,
  multiEdge: false,
  directed: false,
};

export const create: {
  <C extends Config>(config: C): <N, E, I extends Ids>(
    entries?: Entries<N, E, I>
  ) => Either<Error, Graph<N, E, C, I>>;

  <N, E, I extends Ids>(entries?: Entries<N, E, I>): Either<
    Error,
    Graph<N, E, DefaultConfig, I>
  >;
} = 'TODO' as any;

export const toEntries = <C extends Config, I extends Ids, E, N>(
  graph: Graph<N, E, C, I>
): Entries<N, E, I> => 'TODO' as any;
