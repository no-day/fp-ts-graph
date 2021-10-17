import { Ids } from 'Graph';
import { Config, Graph } from 'Graph/type';

export const empty =
  <C extends Config>(config: C) =>
  <N, E, I extends Ids>(): Graph<N, E, C, I> =>
    'TODO' as any;
