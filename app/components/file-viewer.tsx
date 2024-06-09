"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import { Trash } from "lucide-react";
import { list } from "@vercel/blob";
import { uploadToS3 } from "../lib/s3";

export default function Fileviewer() {
  const [files, setFiles] = useState([]);

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

    // // Vercel blob put method only can handle one file at a time. So need to loop it
    // for (const file of fileList) {
    //   const response = await fetch(`/api/upload?filename=${file.name}`, {
    //     method: "POST",
    //     body: file,
    //   });

    //   const newBlob = (await response.json()) as PutBlobResult;

    //   uploadPromises.push(newBlob);
    // }

    // try {
    //   // Promise all is used to wait for all uploads to finish
    //   const results = await Promise.all(uploadPromises);
    //   console.log(results); // Handle or display the results as needed
    // } catch (error) {
    //   console.error("Error uploading files:", error);
    // }

    //Getting updated files from Blob & this is causing ERRORSSS zzzz
    // const fetchFiles = await list();
    // setFiles(fetchFiles.blobs as any);
    // console.log(fetchFiles);
  }

  return (
    <div className="bg-slate-50 p-6 min-h-full w-[480px] rounded-2xl flex flex-col">
      <div className="flex flex-col flex-grow">
        <p>Place to hold the files</p>
        <Trash className="w-4 h-4" />
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
