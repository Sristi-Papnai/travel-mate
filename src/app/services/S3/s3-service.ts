import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

  export async function getPresignedUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    });
    
    
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    // ✅ Server action for presigned GET URL
  export async function GetObjectCommandService(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
    });

    // Expires in 15 minutes
    return await getSignedUrl(s3, command, { expiresIn: 900 });
  }