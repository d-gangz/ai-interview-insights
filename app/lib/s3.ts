// note to install npm install aws-sdk/client-s3
import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

// Initialising an S3 instance
const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    // need NEXT_PUBLIC in front cuz it is being called by client component
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
});

// the file: File is standard web api file type
export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const file_key =
        // this means upload to an uploads folder so we can organise it properly
        "uploads/" + Date.now().toString() + "-" + file.name.replace(" ", "-");

      const params = {
        // store your bucket name. The ! tells typescript it will definitely have a value
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };

      /* 
        If you dont wrap in a promise, it returns an AWS.Request object instead.
        So we need to wrap it in a promise so that we can use async/await for handling the response,
        making the code more readable and easier to manage.
      */
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

// returns the file names from the S3 bucket
// ---Question: why use return new Promise?
export async function listFiles(): Promise<string[]> {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (err: any, data: any) => {
      if (err) {
        console.error("Error", err);
        reject(err);
      } else {
        const filenames = data.Contents.map((file: any) => {
          const splitKey = file.Key.split("-");
          return splitKey.slice(1).join("-"); // Join back the remaining parts if there are multiple '-' in the name
        });
        console.log("File Names:", filenames);
        // This means you are passing this value as the result of the promise
        resolve(filenames);
      }
    });
  });
}
