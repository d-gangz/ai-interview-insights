// npm install openai-edge
// allows us to run OpenAI on the edge
// Alternative to the openai package that is edge compatible
import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// Utilising the OpenAI embeddings api to get the embeddings of a string (i.e convert a text into a vector)
export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      // regex to replace all new lines with a space
      input: text.replace(/\n/g, " "),
    });
    /* 
    What is returned is a Response object (not a javascript object) which includes not just the body of the response, but also metadata such as status codes and headers.
    The response.json() method is used to explicitly parse the JSON content of the response body into a JavaScript object.
    */
    const result = await response.json();
    // embedding data is an array of floating point numbers. The number[] is just extra type safety
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
