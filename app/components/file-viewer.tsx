"use client";

import { useState, useRef } from "react";
import { Trash } from "lucide-react";
import { listFiles, uploadToS3 } from "../lib/s3";

export default function Fileviewer() {
  const [files, setFiles] = useState<string[]>([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    console.log(inputFileRef.current.files);

    // cannot loop a FileList, so needa convert it into an Array first.
    const fileList = Array.from(inputFileRef.current.files);
    // Array to hold the promises
    const uploadPromises = [];

    // Loop through each file and upload to S3
    for (const file of fileList) {
      const data = await uploadToS3(file);
      uploadPromises.push(data);
    }

    try {
      // Promise all is used to wait for all uploads to finish
      const results = await Promise.all(uploadPromises);
      console.log("Upload success", results);
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    // list all files uploaded to s3.
    // We can't directly retrieve from results cuz what if user uploads one by one.
    const filesfromS3 = await listFiles();
    setFiles(filesfromS3);
  }

  return (
    <div className="bg-slate-50 p-6 min-h-full w-[480px] rounded-2xl flex flex-col">
      <div className="flex flex-col flex-grow">
        <p className="text-lg font-bold mb-4">Uploaded Files</p>
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4 pt-24 pb-3">
        <p>Attach files for file search</p>
        <div className="flex flex-col">
          <label
            htmlFor="file-upload"
            className="bg-slate-800 text-white h-12 px-6 cursor-pointer flex justify-center items-center rounded-lg"
          >
            Attach files
          </label>
          <input
            type="file"
            id="file-upload"
            name="file-upload"
            className="hidden"
            ref={inputFileRef}
            multiple
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
