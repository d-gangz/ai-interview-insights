// note to install npm install aws-sdk
import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

// the file: File is standard web api file type
export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "ap-southeast-1",
        credentials: {
          // need NEXT_PUBLIC in front cuz it will be exposed to client component.
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const file_key =
        // this means upload to an uploads folder so we can organise it properly
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        // store your bucket name. The ! tells typescript it will definitely have a value
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

// This one will give us a publicly accessible S3 URL so that we are able embed PDF to our chat screen later
export function getS3Url(file_key: string) {
  // This is the standard format that s3 will read. It will always be bucket name, region, and the file key
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`;
  return url;
}
