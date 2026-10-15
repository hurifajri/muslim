export const POSTER_WIDTH = 1080;
export const POSTER_HEIGHT = 1920;

export function canvasToJpeg(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) return reject(new Error('Gagal membuat gambar.'));
        resolve(new File([blob], 'doa-poster.jpg', { type: blob.type }));
      },
      'image/jpeg',
      0.92
    );
  });
}

export async function sharePosterFile(
  file: File,
  title: string,
  sharing:
    | Pick<Navigator, 'canShare' | 'share'>
    | Partial<Pick<Navigator, 'canShare' | 'share'>> = navigator
) {
  try {
    if (!sharing.share || !sharing.canShare?.({ files: [file] }))
      return 'unsupported';
    await sharing.share({ files: [file], title });
    return 'shared';
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError'
      ? 'cancelled'
      : 'failed';
  }
}
