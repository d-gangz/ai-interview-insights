import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

// We need the filekey to get the correct namespace
export async function getMatchesFromEmbeddings(embeddings: number[]) {
  try {
    // initialising pinecone
    const client = new Pinecone({
      //   environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("interview-insights");
    const namespace = pineconeIndex.namespace(convertToAscii("insights"));
    const queryResult = await namespace.query({
      //topK is telling pinecone how many matches we want to get
      topK: 5,
      // Vector we wana query against
      vector: embeddings,
      // Include the metadata to get back original text from the matches
      includeMetadata: true,
    });
    // it will return an array of 5 vectors cuz our topK was 5.
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

// query is like what is being asked by the user
export async function getContext(query: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings);

  // look through all matches and only return those higher than 70%
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  // Getting back the text from the metadata
  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // Taking the 5 paragraph from the 5 vectors and join it together. This will be the context block.
  // if docs exceed 3000 characters, we wana cut it off as we dont wana feed in too much information.
  return docs.join("\n").substring(0, 3000);
}
