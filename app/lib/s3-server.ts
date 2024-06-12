import { S3 } from "@aws-sdk/client-s3";
// we need this fs to download the file to our file system
import fs from "fs";

// this function takes in a file_key and then download it into the specific folder
export default async function downloadFromS3(
  file_key: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "ap-southeast-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });
      const params = {
        // store your bucket name. The ! tells typescript it will definitely have a value
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);
      // Generate a unique file name for the downloaded file
      const file_name = `/tmp/gang${Date.now().toString()}.pdf`;

      // Check if body of response is a readable stream
      // Important because data from S3 is streamed
      if (obj.Body instanceof require("stream").Readable) {
        // AWS-SDK v3 has some issues with their typescript definitions, but this works
        // https://github.com/aws/aws-sdk-js-v3/issues/843
        //Creates a writable stream to specified file_name. Stream used to write data to local file system.
        const file = fs.createWriteStream(file_name);
        // Setup event listener for the "open" event from the createWriteStream. When "open" is emitted, the callback function is called.
        file.on("open", function () {
          // @ts-ignore <-- Ques: what is this?
          // Pipe the readable stream (obj.Body) from S3 to the writable file stream.
          // Listen for the 'finish' event from createWriteStream to resolve the promise with the file name.
          // pipe method allows you to connect a readable stream to a writable stream
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });
        // obj.Body?.pipe(fs.createWriteStream(file_name));
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");
