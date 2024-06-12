import downloadFromS3 from "./s3-server";

export async function loadIntoPinecone(filekey: string): Promise<any> {
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(filekey);
  console.log("file downloaded to");
  return new Promise((resolve, reject) => {
    // Simulate async operation
    resolve(file_name);
  });
}
