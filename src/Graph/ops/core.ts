import { Config, Graph } from 'Graph/type';

export const empty =
  <Cfg extends Config>(config: Cfg) =>
  <Id, Edge, Node>(): Graph<Cfg, Id, Edge, Node> =>
    'TODO' as any;
