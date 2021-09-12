import { Key } from './type';

export type Error = FromKeyNotFound | ToKeyNotFound | ConnectionExists;

export interface FromKeyNotFound {
  readonly FromKeyNotExists: unique symbol;
  readonly from: Key;
}

export interface ToKeyNotFound {
  readonly ToKeyNotExists: unique symbol;
  readonly to: Key;
}

export interface ConnectionExists {
  readonly ConnectionNotExists: unique symbol;
  readonly from: Key;
  readonly to: Key;
}
