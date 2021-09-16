import { Graph } from '../src';
import { Codec } from 'io-ts/Codec';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as Dec from 'io-ts/Decoder';

// First, let's define some custom Id, Edge and Node type for our Graph

export type MyId = number;

export type MyNode = { firstName: string; lastName: string; age: number };

export type MyEdge = { items: number[] };

// With this we can define a customized Graph type

export type MyGraph = Graph<MyId, MyEdge, MyNode>;

export const MyIdCodec: Codec<string, string, MyId> = {
  encode: (a: MyId) => a.toString(),
  decode: (i: string) =>
    pipe(
      Number(i),
      E.fromPredicate(
        (parsed: number) => !isNaN(parsed) && i.length > 0,
        () => Dec.error(i, `${i} is not a number`)
      )
    ),
};
