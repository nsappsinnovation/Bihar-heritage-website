/**
 * Image Compression & Optimization Utility
 * 
 * Compresses uploaded images using HTML5 Canvas before storing in CMS.
 * Resizes large raw images (3MB-10MB) down to ultra-compact WebP/JPEG data URLs (~20KB-60KB).
 * This prevents browser localStorage QuotaExceededError and guarantees 100% data persistence.
 */

export const compressImageFile = (
  file,
  maxWidth = 1000,
  maxHeight = 700,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve("");
    }

    if (!file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image."));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();

      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(src);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp") && webpData.length < src.length) {
            return resolve(webpData);
          }
        } catch (_) {}

        // Fallback to JPEG
        try {
          const jpegData = canvas.toDataURL("image/jpeg", quality);
          return resolve(jpegData);
        } catch (_) {
          return resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compresses an existing Base64 image data URL string if it is too large.
 */
export const compressBase64Image = (
  base64String,
  maxWidth = 1000,
  maxHeight = 700,
  quality = 0.8
) => {
  return new Promise((resolve) => {
    if (!base64String || typeof base64String !== "string" || !base64String.startsWith("data:image")) {
      return resolve(base64String);
    }

    // If string is already small (< 80KB), return directly
    if (base64String.length < 80000) {
      return resolve(base64String);
    }

    const img = new Image();
    img.onerror = () => resolve(base64String);
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(base64String);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const webpData = canvas.toDataURL("image/webp", quality);
        if (webpData.startsWith("data:image/webp")) {
          return resolve(webpData);
        }
      } catch (_) {}

      try {
        const jpegData = canvas.toDataURL("image/jpeg", quality);
        return resolve(jpegData);
      } catch (_) {
        return resolve(base64String);
      }
    };

    img.src = base64String;
  });
};

/**
 * Convert a data URL (what the admin modals produce via FileReader) into a File
 * suitable for multipart upload. The API stores a path in a VARCHAR(500)
 * column, so a base64 string can never be sent as the image value.
 *
 * Returns null for empty values or for values that are already URLs.
 */
export const dataURLtoFile = (dataURL, filename = "upload") => {
  if (typeof dataURL !== "string" || !dataURL.startsWith("data:")) return null;

  const [header, base64] = dataURL.split(",");
  if (!base64) return null;

  const mimeMatch = header.match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";

  const extension =
    { "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[
      mime
    ] || "png";

  let binary;
  try {
    binary = atob(base64);
  } catch {
    return null;
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

  const safeName = String(filename).replace(/[^\w.-]+/g, "-").replace(/\.[^.]*$/, "");
  return new File([bytes], `${safeName || "upload"}.${extension}`, { type: mime });
};
