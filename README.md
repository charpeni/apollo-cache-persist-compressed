# apollo3-cache-persist-compressed <a href="https://www.npmjs.org/package/apollo3-cache-persist-compressed"><img src="https://badge.fury.io/js/apollo3-cache-persist-compressed.svg" alt="Current npm package version." /></a> <a href="https://www.npmjs.org/package/apollo3-cache-persist-compressed"><img src="https://img.shields.io/npm/dm/apollo3-cache-persist-compressed" alt="Monthly downloads" /></a> <a href="https://circleci.com/gh/charpeni/merge-drivers-cli"><img src="https://circleci.com/gh/charpeni/apollo-cache-persist-compressed.svg?style=shield" alt="Current CircleCI build status." /></a> <a href="https://github.com/charpeni/apollo-cache-persist-compressed/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="apollo-cache-persist-compressed is released under the MIT license." /></a>

Exposes wrappers built on top of [`apollo3-cache-persist`](https://github.com/apollographql/apollo-cache-persist), but leverages compression via GZip (powered by [`fflate`](https://github.com/101arrowz/fflate)) to reduce the size of the stored cache.

Currently, the only wrapper exposed is `CompressedLocalForageWrapper`, which is a drop-in replacement for `LocalForageWrapper` from `apollo3-cache-persist`, but persists the cache in a compressed format. [`localForage`](https://github.com/localForage/localForage) supports all sorts of JavaScript objects, including binary data (`Uint8Array`), so it's a good choice for persisting compressed data as binary, which saves us from having to convert the compressed binary to a base64 string.

Compressing strings, especially Apollo Client's cache is quite efficient because a cache (even a normalized one) will have a lot of repeated tokens, which can be compressed quite well. The GZip compression is powered by [`fflate`](https://github.com/101arrowz/fflate).

**Compresses a cache of 1 MB into 60 KB in 22ms** 🔥 _(Tested on an M1 Pro)_.

By default, `apollo3-cache-persist` only persists a stringified version of the cache up to 1,048,576 characters (1 MB), which can be quickly reached with a cache of a few hundred entities. This library allows you to compress the cache before persisting it, which can save a lot of space while ensuring you can leverage the full power of Apollo Client's cache rather than purging the cache every few interactions.

## Usage

> [!WARNING]
> `apollo3-cache-persist-compressed` is meant to be used on top of `apollo3-cache-persist`, make sure to install both!

```sh
npm install --save apollo3-cache-persist apollo3-cache-persist-compressed
```

or

```sh
yarn add apollo3-cache-persist apollo3-cache-persist-compressed
```

Finally, use `CompressedLocalForageWrapper` as a drop-in replacement for `LocalForageWrapper`:

> [!CAUTION]
> The compressed storage doesn't support migrating from a string-based cache. Therefore, it's really important to version your localForage via the `name` config!

> [!IMPORTANT]
> Ensure the `serialize` option on `persistCache` isn't turned off, as the compression expects to receive a serialized version of the cache to compress it as a string. `serialize` defaults to `true`.

```javascript
import { InMemoryCache } from '@apollo/client/core';
import { persistCache } from 'apollo3-cache-persist';
import { CompressedLocalForageWrapper } from 'apollo3-cache-persist-compressed';
import localforage from 'localforage';

const cache = new InMemoryCache({...});

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'apollo-cache-v2',
});

// await before instantiating ApolloClient, else queries might run before the cache is persisted
await persistCache({
  cache,
  storage: new CompressedLocalForageWrapper(localforage),
  serialize: true,
});

// Continue setting up Apollo as usual.

const client = new ApolloClient({
  cache,
  ...
});
```

## License

apollo-cache-persist-compressed is [MIT licensed](LICENSE).
