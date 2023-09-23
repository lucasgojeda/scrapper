import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createS3Link = async (key) => {
  const region = process.env.AWS_S3_REGION;
  const bucket = process.env.AWS_S3_BUCKET;

  try {
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const clientUrl = await getSignedUrl(client, command, {
      expiresIn: 157680000,
    });

    console.log("Presigned URL with client");
    console.log(clientUrl);

    return clientUrl;
  } catch (err) {
    console.error(err);
  }
};
