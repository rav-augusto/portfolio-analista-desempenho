/**
 * Converte uma imagem para WebP com compressao
 * Reduz significativamente o tamanho do arquivo
 */
export async function convertToWebP(
  file: File | Blob,
  quality: number = 0.8,
  maxWidth: number = 1200
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calcular dimensoes mantendo proporcao
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      // Criar canvas e desenhar imagem
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Erro ao criar contexto do canvas'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Converter para WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Erro ao converter imagem'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Erro ao carregar imagem'))
    }

    img.src = url
  })
}

/**
 * Converte imagem para WebP e retorna como File
 */
export async function convertToWebPFile(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1200
): Promise<File> {
  const blob = await convertToWebP(file, quality, maxWidth)
  const fileName = file.name.replace(/\.[^/.]+$/, '.webp')
  return new File([blob], fileName, { type: 'image/webp' })
}
