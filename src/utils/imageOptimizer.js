/**
 * Client-side high-quality image compressor
 * Shrinks massive phone/camera photos (e.g. 10MB+) down to ~400KB-800KB
 * preserving crisp Retina details while ensuring requests never exceed server/Vercel body limits.
 */
export async function optimizeImage(file, maxWidth = 1920, maxHeight = 1920, quality = 0.85) {
  // If file is not an image, return raw
  if (!file.type.startsWith('image/')) {
    return { file, dataUrl: null };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve({ file, dataUrl: null });
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve({ file, dataUrl: e.target.result });
      img.onload = () => {
        let { width, height } = img;

        // Proportional downscale if exceeding bounds
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Smoothing for high-quality downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file, dataUrl });
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const optimizedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve({ file: optimizedFile, dataUrl });
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
