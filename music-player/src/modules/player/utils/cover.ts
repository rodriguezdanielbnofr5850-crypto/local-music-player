import jsmediatags from 'jsmediatags'

export function extractCover(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        if (tag.tags && tag.tags.picture) {
          const pic = tag.tags.picture
          const blob = new Blob([new Uint8Array(pic.data)], { type: pic.format })
          resolve(URL.createObjectURL(blob))
        } else {
          resolve(null)
        }
      },
      onError: () => resolve(null)
    })
  })
}