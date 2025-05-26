// utils/url-to-file.js

/**
 * Detect MIME type from file extension
 * @param {string} filename - The filename or URL
 * @returns {string} - The MIME type
 */
const getMimeTypeFromExtension = (filename) => {
  const extension = filename?.toLowerCase()?.split(".").pop();

  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
  };

  return mimeTypes[extension] || "image/jpeg"; // Default to jpeg if unknown
};

/**
 * Convert URL to File object with correct MIME type
 * @param {string} url - The image URL
 * @param {string} filename - The filename
 * @returns {Promise<File>} - Promise that resolves to File object
 */
export const urlToFile = async (url, filename) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();

    // Detect correct MIME type from filename extension
    const correctMimeType = getMimeTypeFromExtension(filename);

    // Create new blob with correct MIME type if current type is generic
    const finalBlob =
      blob.type === "application/octet-stream" || !blob.type
        ? new Blob([blob], { type: correctMimeType })
        : blob;

    // Create File object with correct MIME type
    const file = new File([finalBlob], filename, {
      type: correctMimeType,
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw new Error(`Failed to convert URL to File: ${error.message}`);
  }
};

/**
 * Validate if file is an image based on MIME type
 * @param {File} file - The file to validate
 * @returns {boolean} - True if file is an image
 */
export const validateImageFile = (file) => {
  return file.type.startsWith("image/");
};

/**
 * Get image dimensions from File
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};
