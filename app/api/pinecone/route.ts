import {
  embedDocument,
  getPineconeClient,
  prepareDocument,
} from "@/app/lib/pinecone";
import downloadFromS3 from "@/app/lib/s3-server";
// npm install @langchain/community
// npm install pdf-parse need this so that langchain can properly parse the pdf for us
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { convertToAscii } from "@/app/lib/utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    // metadata gives us the location (loc) which is the page number
    loc: { pageNumber: number };
  };
};

// Main task is to load S3 into pinecone
export async function POST(req: Request) {
  const { filekey, filename } = await req.json();
  // Here the download is verified to be working
  const file_name = await downloadFromS3(filekey, filename);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  // PDFLoader from Langchain can help you convert PDF into text streams.
  const loader = new PDFLoader(file_name);
  /* 
  This will return us with all the pages within the PDF. Here is split by pages.
  Pages will be an array of docs with metadata like the page number.
  */
  const pages = (await loader.load()) as PDFPage[];
  /* 
  But splitting by pages is not as good cuz we want each vector to contain a small paragraph.
  So use the pinecone's recursive text splitter to do it (in step 2)
  */

  // 2. split and segment the pdf
  // call the prepare document function on a single page
  // pages may be array of 13 pages then documents might be array of 100 documents
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  // .flat is a method used on arrays to flatten nested arrays (arrays within arrays) into a single level array
  /*
  documents might look like this:
  [
    [Document1, Document2], // Documents from page 1
    [Document3],            // Document from page 2
    [Document4, Document5]  // Documents from page 3
  ]
  Then each doc is passed into the embededDocument function
  */
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  // this index is the name of the vector DB or pinecone index
  const pineconeIndex = await client.index("interview-insights");
  // Best for all docs to be in same namespace for ease of matching
  // The namespace needs to be in Ascii characters else Pinecone will have an error.
  const namespace = pineconeIndex.namespace(convertToAscii("insights"));

  console.log("inserting vectors into pinecone");
  // Push vectors to the specified namespace
  await namespace.upsert(vectors);

  // return the 1st document just for the sake of it
  return Response.json(documents);
}
