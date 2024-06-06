"use server";

// export async function handleFileUpload(files: FileList) {
//   if (files.length === 0) {
//     console.log("No files uploaded.");
//     return;
//   }

//   // Assuming you want to log the first file for simplicity
//   const file = files[0];
//   console.log(file.name); // Log the file name to check if files are being received

//   // If you need to use FormData for further processing, you can do it here
//   const formData = new FormData();
//   formData.append("file", file);

//   // Log the FormData contents (for debugging)
//   console.log(formData.get("file"));
// }

export async function handleFileUpload(formData: FormData) {
  console.log(formData.get("file"));
}
