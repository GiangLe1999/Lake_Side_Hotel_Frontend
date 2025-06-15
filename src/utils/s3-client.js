import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_KEY;

export const s3Client = new S3Client({
  region: region || "us-east-1",
  credentials: {
    accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  checksumMode: "WHEN_SUPPORTED",
});
