import { list } from "@vercel/blob";

export async function fetchFiles(setFiles: (files: any) => void) {
  const files = await list();
  return setFiles(files);
}
