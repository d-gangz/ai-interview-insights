import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
// npm install md5 @types/md5
import md5 from "md5";
// npm install @pinecone-database/doc-splitter
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";

type PDFPage = {
  pageContent: string;
  metadata: {
    // metadata gives us the location (loc) which is the page number
    loc: { pageNumber: number };
  };
};

export const getPineconeClient = () => {
  return new Pinecone({
    //   environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

// The document type is from pinecone
export async function embedDocument(doc: Document) {
  try {
    // getEmbeddings uses the OpenAI's API to get the embeddings of a string
    const embeddings = await getEmbeddings(doc.pageContent);
    /*
      md5 is a hashing function that converts the string into a unique hash that
      serve as unique identifier for the content to be used in pinecone.
      Note: install the types for md5 using @types/md5
      */
    const hash = md5(doc.pageContent);

    return {
      // the hash is the id of the vector
      id: hash,
      values: embeddings,
      metadata: {
        // Get this from the new Document defined in the prepareDocument function
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
      // Constructs and returns an object that adheres to the PineconeRecord type which you called from above
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

// Ensure that the string we pass in is within the bytes specified.
export const truncateStringByBytes = (str: string, bytes: number) => {
  // TextEncoder is a built-in global object
  const enc = new TextEncoder();
  // Encode the string into a Uint8Array and then slice it to the specified byte length
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

// Takes in a singular page and split it into chunks
// Note to install the doc-splitter package from pinecone
export async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  // regex to replace all new line with empty string
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  // Document object is passed to the splitDocuments to be split up into text chunks
  const docs = await splitter.splitDocuments([
    // each Document is initialised with entire content of a pdf page
    // This Document instance is from Pinecone
    new Document({
      pageContent, // comes from PDF page
      metadata: {
        // We specified this custom metadata
        pageNumber: metadata.loc.pageNumber,
        // pinecone only accept up to 36K bytes
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  // takes a single page and splits up into multiple docs. So it can split up into 5-6 paragraphs
  return docs;
}
