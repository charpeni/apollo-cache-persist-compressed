import {
  type PersistentStorage,
  LocalForageWrapper,
} from 'apollo3-cache-persist';
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate';

import type {
  LocalForageInterface,
  LocalForageWrapper as LocalForageWrapperGenericInterface,
} from './LocalForageWrapper.js';

/**
 * A storage wrapper based on `LocalForageWrapper` that compresses and decompresses the items,
 * using `fflate`.
 *
 * Items are stored as binary data (`Uint8Array`) directly in IndexedDB, which is more efficient.
 */
export class CompressedLocalForageWrapper
  implements PersistentStorage<string | null>
{
  private storage: LocalForageWrapperGenericInterface<Uint8Array>;

  constructor(storage: LocalForageInterface<Uint8Array>) {
    // @ts-expect-error -- This is caused by our own interface, which is not compatible with the one from `apollo3-cache-persist`.
    this.storage = new LocalForageWrapper(storage);
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key).then((compressed) => {
      if (compressed === null) {
        return null;
      }

      const decompressed = decompressSync(compressed);

      return strFromU8(decompressed);
    });
  }

  setItem(key: string, value: string | null): Promise<void> {
    const buf = strToU8(value || '');
    const compressed = compressSync(buf);

    return this.storage.setItem(key, compressed);
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }
}
