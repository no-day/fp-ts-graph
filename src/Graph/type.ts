import { Either } from 'fp-ts/Either';
import { ConnectionRecord } from 'ConnectionRecord';

type Id = string;

type EdgeId = Id;

type NodeId = Id;

export type Config = {
  directed: boolean;
  multiEdge: boolean;
  cyclic: boolean;
};

export interface Graph<Cfg extends Config, Id, Edge, Node> {
  readonly _brand: unique symbol;
  readonly nodes: Record<NodeId, Node>;
  readonly edges: Record<EdgeId, Edge>;
  readonly outgoing: ConnectionRecord<Set<EdgeId>>;
  readonly incoming: ConnectionRecord<Set<EdgeId>>;
}
