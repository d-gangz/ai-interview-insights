import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData } from "ai";

// This route handler creates a POST request endpoint at /api/chat

export async function POST(req: Request) {
  // message variable contains a history of the convo with you and the chatbot
  // It will provide the chatbot with neccessary context to make the next generation
  const { messages } = await req.json();

  // streamtext function will take the messages and return a StreamTextResult.
  // This results object contains toAIStream function which will be use to convert stream to format compatible with StreamingTextResponse.
  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
  });

  // This will set required headers and response details to allow client to stream the response
  return new StreamingTextResponse(result.toAIStream());
}
