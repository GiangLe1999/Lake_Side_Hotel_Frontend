import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-client";

const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;

const generateFileName = (file) => {
  if (!file) throw new Error("File is required");

  // Loại bỏ ký tự đặc biệt và chuyển về ASCII an toàn
  const sanitizedName = file.name
    .normalize("NFD") // Tách ký tự có dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/[^\w\s.-]/g, "") // Chỉ giữ chữ, số, dấu cách, chấm, gạch ngang
    .replace(/\s+/g, "_") // Thay dấu cách bằng gạch dưới
    .toLowerCase(); // Chuyển về chữ thường

  return `${Date.now()}_${sanitizedName}`;
};

export const uploadFileToS3 = async (file, folder = "") => {
  if (!file) throw new Error("File is required");

  const key = `${folder}/${generateFileName(file)}`;

  // Chuyển File thành ArrayBuffer để tránh lỗi stream
  const fileBuffer = await file.arrayBuffer();

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer, // Dùng ArrayBuffer thay vì File object
    ContentType: file.type,
    // Lưu tên gốc trong metadata (encode để tránh lỗi)
    Metadata: {
      originalName: encodeURIComponent(file.name),
      uploadedAt: new Date().toISOString(),
      fileSize: file.size.toString(),
    },
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);

    console.log("Upload successful:", result);
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};
