import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

// Upload function (same as before)
export async function uploadFileToS3(
  userId: number,
  fileName: string,
  fileBuffer: Buffer,
  fileType: string
) {
  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: `profile-pictures/${userId}-${fileName}`,
    Body: fileBuffer,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return `profile-pictures/${userId}-${fileName}`;
}

export async function generatePresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
