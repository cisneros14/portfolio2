/**
 * Compresses an image file if it exceeds the specified size limit.
 * @param file The original image file.
 * @param maxSizeMB The maximum allowed size in megabytes (default: 2).
 * @returns A Promise that resolves to the compressed File (or the original if no compression was needed).
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 2
): Promise<File> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Optional: Resize if dimensions are huge (e.g., > 4000px) to help with size
      const maxDimension = 2560; // 1440p standard width
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Iterative compression
      let quality = 0.9;
      const attemptCompression = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            if (blob.size <= maxSizeBytes || quality <= 0.1) {
              // Create a new File object
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg", // Convert to JPEG for better compression
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              attemptCompression();
            }
          },
          "image/jpeg",
          quality
        );
      };

      attemptCompression();
    };
    img.onerror = (err) => reject(err);
  });
}
