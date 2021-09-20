---
title: ImmutableMap.ts
nav_order: 1
parent: Modules
---

## ImmutableMap overview

Added in v0.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [modifyAt](#modifyat)
  - [upsertAt](#upsertat)
- [Utils](#utils)
  - [lookup](#lookup)

---

# Combinators

## modifyAt

Update a key/value pair in an immutable `Map`.

**Signature**

```ts
export declare const modifyAt: <K>(
  E: Encoder<string, K>
) => <A>(k: K, f: (a: A) => A) => (m: Map<string, A>) => Option<Map<string, A>>
```

Added in v0.3.0

## upsertAt

Insert or replace a key/value pair in an immutable `Map`.

**Signature**

```ts
export declare const upsertAt: <K>(E: Encoder<string, K>) => <A>(k: K, a: A) => (m: Map<string, A>) => Map<string, A>
```

Added in v0.3.0

# Utils

## lookup

Lookup the value for a key in an immutable `Map`.

**Signature**

```ts
export declare const lookup: <K>(E: Encoder<string, K>) => (k: K) => <A>(m: Map<string, A>) => Option<A>
```

Added in v0.3.0
