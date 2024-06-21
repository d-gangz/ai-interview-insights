import { getContext } from "@/app/lib/context";
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData, Message } from "ai";

// This route handler creates a POST request endpoint at /api/chat

export async function POST(req: Request) {
  // message variable contains a history of the convo with you and the chatbot
  // It will provide the chatbot with neccessary context to make the next generation
  const { messages } = await req.json();

  // -- here are the extra added for the context fetching --
  // last message sent in by the user is the query itself.
  const lastMessage = messages[messages.length - 1];
  // return whole paragraph of relevant vectors and their page content.
  const context = await getContext(lastMessage.content);

  const prompt = {
    role: "system",
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
  };
  // -- here are the extra added for the context fetching --

  // streamtext function will take the messages and return a StreamTextResult.
  // This results object contains toAIStream function which will be use to convert stream to format compatible with StreamingTextResponse.
  const result = await streamText({
    model: openai("gpt-4o"),
    // messages,
    // for the messages array passed into openAI, pass in the prompt and all the msges by the user
    // we dont include the AI messages so we can save some token space
    messages: [
      prompt,
      ...messages.filter((message: Message) => message.role === "user"),
    ],
  });

  // This will set required headers and response details to allow client to stream the response
  return new StreamingTextResponse(result.toAIStream());
}
