import assert from 'node:assert/strict';
import { test } from 'node:test';

import { canvasToJpeg, sharePosterFile } from '@/lib/poster-export';

test('poster encoding explicitly requests JPEG and rejects empty output', async () => {
  let requested = '';
  const canvas = {
    toBlob(callback: BlobCallback, type: string) {
      requested = type;
      callback(new Blob(['image'], { type }));
    },
  } as unknown as HTMLCanvasElement;
  const file = await canvasToJpeg(canvas);
  assert.equal(requested, 'image/jpeg');
  assert.equal(file.type, 'image/jpeg');
  const empty = {
    toBlob(callback: BlobCallback) {
      callback(null);
    },
  } as unknown as HTMLCanvasElement;
  await assert.rejects(canvasToJpeg(empty), /gambar/);
});

test('unavailable/rejected native sharing preserves file for download', async () => {
  const file = new File(['image'], 'doa-poster.jpg', { type: 'image/jpeg' });
  assert.equal(await sharePosterFile(file, 'Doa', {}), 'unsupported');
  assert.equal(
    await sharePosterFile(file, 'Doa', {
      canShare: () => true,
      share: async () => {
        throw new Error('denied');
      },
    }),
    'failed'
  );
  assert.equal(
    await sharePosterFile(file, 'Doa', {
      canShare: () => true,
      share: async () => {
        throw new DOMException('cancel', 'AbortError');
      },
    }),
    'cancelled'
  );
  assert.equal(file.size, 5);
});
