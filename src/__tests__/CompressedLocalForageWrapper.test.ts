import { compressSync, strToU8 } from 'fflate';

import { CompressedLocalForageWrapper } from '../CompressedLocalForageWrapper';
import type { LocalForageInterface } from '../LocalForageWrapper';

describe('CompressedLocalForageWrapper', () => {
  let storageMock: LocalForageInterface<Uint8Array>;
  let wrapper: CompressedLocalForageWrapper;

  beforeEach(() => {
    storageMock = {
      getItem: jest.fn(),
      setItem: jest.fn().mockResolvedValue(undefined),
      removeItem: jest.fn(),
    };
    wrapper = new CompressedLocalForageWrapper(storageMock);
  });

  describe('getItem', () => {
    it('returns decompressed string for a given key', async () => {
      const expectedData = 'test string';
      const compressedData = compressSync(strToU8(expectedData));

      (storageMock.getItem as jest.Mock).mockResolvedValue(compressedData);

      const key = 'test-key';

      const result = await wrapper.getItem(key);

      expect(result).toEqual(expectedData);
      expect(storageMock.getItem).toHaveBeenCalledWith(key);
    });

    it('returns null if no data is found for a key', async () => {
      (storageMock.getItem as jest.Mock).mockResolvedValue(null);

      const result = await wrapper.getItem('non-existent-key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('stores compressed data', async () => {
      const value = 'test string';

      await wrapper.setItem('testKey', value);

      expect(storageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        expect.any(Uint8Array),
      );
    });
  });

  describe('removeItem', () => {
    it('removes an item by key', async () => {
      await wrapper.removeItem('testKey');

      expect(storageMock.removeItem).toHaveBeenCalledWith('testKey');
    });
  });
});
