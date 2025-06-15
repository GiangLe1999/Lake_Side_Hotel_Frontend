import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3-client";

const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;

/**
 * Dùng getS3Url khi Bucket hoặc object không public:
 * Bạn cần tạo signed URL (URL có thời hạn, bảo mật):
 * Chỉ người có URL (trong thời gian cho phép) mới truy cập được file.
 * Dùng trong hệ thống có kiểm soát quyền truy cập, ví dụ:
 * - Ứng dụng yêu cầu người dùng đã đăng nhập mới được xem file.
 * - Tải xuống hóa đơn, tài liệu cá nhân, ảnh riêng tư v.v.
 */

/**
 * Dùng getPublicS3Url khi Bucket và object đã được cấu hình public-read:
 * Không cần bảo mật, bất kỳ ai có URL đều truy cập được vĩnh viễn.
 * Dùng cho các file công khai như:
 * - Ảnh đại diện mặc định.
 * - Tài nguyên tĩnh như banner, icon, ảnh sản phẩm public.
 * - Demo video, file dùng để quảng bá công khai.
 */

/**
 * Lấy signed URL từ một S3 key
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Thời gian hết hạn (giây), mặc định 3600s (1 giờ)
 * @returns {Promise<string>} - Signed URL
 */
export const getS3Url = async (key, expiresIn = 3600) => {
  try {
    if (!key) {
      throw new Error("S3 key is required");
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    return signedUrl;
  } catch (error) {
    console.error("Error generating S3 URL:", error);
    throw error;
  }
};

/**
 * Lấy nhiều signed URLs từ danh sách S3 keys
 * @param {string[]} keys - Mảng các S3 object keys
 * @param {number} expiresIn - Thời gian hết hạn (giây), mặc định 3600s (1 giờ)
 * @returns {Promise<Array<{key: string, url: string, error?: string}>>} - Mảng objects chứa key và URL tương ứng
 */
export const getMultipleS3Urls = async (keys, expiresIn = 3600) => {
  try {
    if (!Array.isArray(keys)) {
      throw new Error("Keys must be an array");
    }

    if (keys.length === 0) {
      return [];
    }

    // Xử lý song song để tăng performance
    const urlPromises = keys.map(async (key) => {
      try {
        const url = await getS3Url(key, expiresIn);
        return {
          key,
          url,
        };
      } catch (error) {
        console.error(`Error generating URL for key ${key}:`, error);
        return {
          key,
          url: null,
          error: error.message,
        };
      }
    });

    const results = await Promise.allSettled(urlPromises);

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          key: keys[index],
          url: null,
          error: result.reason?.message || "Unknown error",
        };
      }
    });
  } catch (error) {
    console.error("Error generating multiple S3 URLs:", error);
    throw error;
  }
};

/**
 * Hàm tiện ích để lấy URL public (nếu bucket được cấu hình public)
 * Chỉ sử dụng khi bucket và objects là public
 * @param {string} key - S3 object key
 * @returns {string} - Public URL
 */
export const getPublicS3Url = (key) => {
  if (!key) {
    throw new Error("S3 key is required");
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Hàm tiện ích để lấy nhiều public URLs
 * @param {string[]} keys - Mảng các S3 object keys
 * @returns {Array<{key: string, url: string}>} - Mảng objects chứa key và public URL
 */
export const getMultiplePublicS3Urls = (keys) => {
  if (!Array.isArray(keys)) {
    throw new Error("Keys must be an array");
  }

  return keys.map((key) => getPublicS3Url(key));
};
