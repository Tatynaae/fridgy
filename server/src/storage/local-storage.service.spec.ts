import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { LocalStorageService } from './local-storage.service.js';

describe('LocalStorageService', () => {
  let root: string;
  let storage: LocalStorageService;

  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'fridgy-storage-'));
    storage = new LocalStorageService(root);
  });

  afterEach(() => rm(root, { recursive: true, force: true }));

  it('saves, reads and deletes an image', async () => {
    const key = await storage.saveImage(
      'scans',
      Buffer.from('jpeg-bytes'),
      'image/jpeg',
    );

    expect(key).toMatch(/^scans\/\d{4}\/\d{2}\/\d{2}\/[0-9a-f-]{36}\.jpg$/);
    expect((await storage.read(key)).toString()).toBe('jpeg-bytes');
    expect(storage.publicUrl(key)).toBe(`/uploads/${key}`);

    await storage.delete(key);
    await expect(stat(path.join(root, key))).rejects.toThrow();
  });

  it('ignores deleting a missing file', async () => {
    await expect(storage.delete('scans/missing.jpg')).resolves.toBeUndefined();
  });

  it('rejects keys outside the storage folder', async () => {
    await expect(storage.read('../outside.jpg')).rejects.toThrow(
      'Invalid storage key',
    );
    await expect(storage.delete('../../etc/passwd')).rejects.toThrow(
      'Invalid storage key',
    );
  });
});
