/** @since 0.3.0 */

import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { Encoder } from 'io-ts/Encoder';
import { Map } from 'immutable';
import { pipe } from 'fp-ts/function';

/**
 * Insert or replace a key/value pair in an immutable `Map`.
 *
 * @since 0.3.0
 * @category Combinators
 */
export const upsertAt =
  <K>(E: Encoder<string, K>) =>
  <A>(k: K, a: A) =>
  (m: Map<string, A>): Map<string, A> => {
    const encodedKey = E.encode(k);
    if (m.has(encodedKey) && m.get(encodedKey) === a) {
      return m;
    }
    return m.set(encodedKey, a);
  };

/**
 * Update a key/value pair in an immutable `Map`.
 *
 * @since 0.3.0
 * @category Combinators
 */
export const modifyAt =
  <K>(E: Encoder<string, K>) =>
  <A>(k: K, f: (a: A) => A) =>
  (m: Map<string, A>): Option<Map<string, A>> => {
    const encodedKey = E.encode(k);
    return pipe(
      m.get(encodedKey, null),
      O.fromNullable,
      O.map((value) => m.set(encodedKey, f(value)))
    );
  };

/**
 * Lookup the value for a key in an immutable `Map`.
 *
 * @since 0.3.0
 * @category Utils
 */
export const lookup =
  <K>(E: Encoder<string, K>) =>
  (k: K) =>
  <A>(m: Map<string, A>): Option<A> =>
    pipe(m.get(E.encode(k), null), O.fromNullable);
