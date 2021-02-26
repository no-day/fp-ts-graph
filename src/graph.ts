/**
 * @since 0.1.0
 */

import * as map from "fp-ts/Map";

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
type Graph<Id, Edge, Node> = {
  readonly _brand: unique symbol;
  readonly nodes: Map<Id, NodeContext<Id, Node>>;
  readonly edges: Map<EdgeId<Id>, Edge>;
};

type NodeContext<Id, Node> = {
  data: Node;
  outgoing: Set<Id>;
  incoming: Set<Id>;
};

type EdgeId<Id> = { from: Id; to: Id };

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const empty: <Id, Edge, Node>() => Graph<Id, Edge, Node> = () =>
  unsafeMkGraph({
    nodes: map.empty,
    edges: map.empty,
  });

// -------------------------------------------------------------------------------------
// internal
// -------------------------------------------------------------------------------------

const unsafeMkGraph = <Id, Edge, Node>(
  graphData: Omit<Graph<Id, Edge, Node>, "_brand">
): Graph<Id, Edge, Node> => graphData as Graph<Id, Edge, Node>;
