import { Graph } from '../src';
import { Codec } from 'io-ts/Codec';
import * as Cod from 'io-ts/Codec';

// First, let's define some custom Id, Edge and Node type for our Graph

export type MyId = string;

export type MyNode = { firstName: string; lastName: string; age: number };

export type MyEdge = { items: number[] };

// With this we can define a customized Graph type

export type MyGraph = Graph<MyId, MyEdge, MyNode>;

export const MyIdCodec: Codec<string, string, string> = Cod.string;
