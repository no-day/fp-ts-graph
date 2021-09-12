import { Either } from 'fp-ts/Either';
import * as Error from './Error';
import { ConnectionRecord, Key } from './type';

export const insertAt =
  (from: Key, to: Key) =>
  <V>(val: V) =>
  (
    rec: ConnectionRecord<V>
  ): Either<Error.ConnectionExists, ConnectionRecord<V>> =>
    'TODO' as any;

export const lookup =
  (from: Key, to: Key) =>
  <V>(
    rec: ConnectionRecord<V>
  ): Either<Error.FromKeyNotFound | Error.ToKeyNotFound, ConnectionRecord<V>> =>
    'TODO' as any;

export const updateAt =
  (from: Key, to: Key) =>
  <V>(val: V) =>
  (
    rec: ConnectionRecord<V>
  ): Either<Error.FromKeyNotFound | Error.ToKeyNotFound, ConnectionRecord<V>> =>
    'TODO' as any;

export const modifyAt =
  (from: Key, to: Key) =>
  <V>(fn: (v: V) => V) =>
  (
    rec: ConnectionRecord<V>
  ): Either<Error.FromKeyNotFound | Error.ToKeyNotFound, ConnectionRecord<V>> =>
    'TODO' as any;

export const deleteAt =
  (from: Key, to: Key) =>
  <V>(
    rec: ConnectionRecord<V>
  ): Either<Error.FromKeyNotFound | Error.ToKeyNotFound, ConnectionRecord<V>> =>
    'TODO' as any;

export const upsertAt =
  (from: Key, to: Key) =>
  <V>(val: V) =>
  (rec: ConnectionRecord<V>): ConnectionRecord<V> =>
    'TODO' as any;
