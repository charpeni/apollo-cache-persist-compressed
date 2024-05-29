import type { PersistentStorage } from 'apollo3-cache-persist';

/**
 * Temporary mirrors of types from `apollo3-cache-persist`.
 *
 * To be replaced when https://github.com/apollographql/apollo-cache-persist/pull/528 will be merged and released.
 */

export interface LocalForageInterface<T = string | object | null> {
  getItem(key: string): Promise<T | null>;
  setItem(key: string, value: T | null): Promise<T | null>;
  removeItem(key: string): Promise<void>;
}

export declare class LocalForageWrapper<T = string | object | null>
  implements PersistentStorage<T>
{
  protected storage: LocalForageInterface;
  constructor(storage: LocalForageInterface);
  getItem(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: T | null): Promise<void>;
}
