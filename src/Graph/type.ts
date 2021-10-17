import { Either } from 'fp-ts/Either';
import { ConnectionRecord } from 'ConnectionRecord';
import { string } from 'fp-ts';

type InternalEdgeId = string;

type InternalNodeId = string;

export type Config = {
  directed: boolean;
  multiEdge: boolean;
  cyclic: boolean;
};

export type DefaultConfig = {
  directed: false;
  multiEdge: false;
  cyclic: false;
};

export type Ids<nodeId = string, edgeId = string> = {
  node: nodeId;
  edge: edgeId;
};

export type DefaultIds = {
  node: InternalNodeId;
  edge: InternalEdgeId;
};

export interface Graph<
  node = unknown,
  edge = unknown,
  cfg extends Config = DefaultConfig,
  ids extends Ids = DefaultIds
> {
  readonly _brand: unique symbol;
  readonly _cfg: cfg;
  readonly _ids: ids;
  readonly _Edge: edge;
  readonly _Node: node;
  readonly nodes: Record<InternalNodeId, node>;
  readonly edges: Record<InternalEdgeId, edge>;
  readonly outgoing: ConnectionRecord<Set<InternalEdgeId>>;
  readonly incoming: ConnectionRecord<Set<InternalEdgeId>>;
}
