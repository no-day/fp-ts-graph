import { Map } from 'immutable';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as C from 'io-ts/Codec';
import * as IM from '../src/ImmutableMap';

describe('ImmutableMap', () => {
  describe('upsertAt', () => {
    test('Should insert two records in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt(C.string)('hello', 'world'),
          IM.upsertAt(C.string)('foo', 'bar')
        )
      ).toStrictEqual(
        Map(<[string, string][]>[
          ['hello', 'world'],
          ['foo', 'bar'],
        ])
      );
    });
  });

  describe('modifyAt', () => {
    test('Should update record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt(C.string)('hello', 'world'),
          IM.upsertAt(C.string)('foo', 'bar'),
          IM.modifyAt(C.string)('hello', () => 'yellow')
        )
      ).toStrictEqual(
        O.some(
          Map(<[string, string][]>[
            ['hello', 'yellow'],
            ['foo', 'bar'],
          ])
        )
      );
    });

    test('Should fail updating missing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt(C.string)('hello', 'world'),
          IM.upsertAt(C.string)('foo', 'bar'),
          IM.modifyAt(C.string)('world', () => 'hello')
        )
      ).toStrictEqual(O.none);
    });
  });

  describe('lookup', () => {
    test('Should lookup existing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt(C.string)('hello', 'world'),
          IM.upsertAt(C.string)('foo', 'bar'),
          IM.lookup(C.string)('foo')
        )
      ).toStrictEqual(O.some('bar'));
    });

    test('Should fail when looking up missing record in a map', () => {
      expect(
        pipe(
          Map<string, string>(),
          IM.upsertAt(C.string)('hello', 'world'),
          IM.upsertAt(C.string)('foo', 'bar'),
          IM.lookup(C.string)('bar')
        )
      ).toStrictEqual(O.none);
    });
  });
});
