import { Either } from 'fp-ts/Either';
import { ConnectionRecord } from 'ConnectionRecord';

type InternalEdgeId = string;

type InternalNodeId = string;

export type Config = {
  directed: boolean;
  multiEdge: boolean;
  cyclic: boolean;
};

export type Ids<NodeId = unknown, EdgeId = unknown> = {
  node: NodeId;
  edge: EdgeId;
};

export type DefaultIds = {
  nodeId: InternalNodeId;
  edgeId: InternalEdgeId;
};

export interface Graph<
  node,
  edge,
  cfg extends Config,
  ids extends Ids<any, any> = DefaultIds
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
