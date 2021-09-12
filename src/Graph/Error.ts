export type Error = NodeExists | NodeNotExists | EdgeExists | EdgeNotExists;

export interface NodeExists {
  readonly NodeExists: unique symbol;
}

export interface NodeNotExists {
  readonly NodeNotExists: unique symbol;
}

export interface EdgeExists {
  readonly EdgeExists: unique symbol;
}

export interface EdgeNotExists {
  readonly EdgeNotExists: unique symbol;
}

export const toString = (error: Error): String => 'TODO' as any;
