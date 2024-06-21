"use client";

// npm install ai
import { useChat } from "ai/react";

export default function Chat() {
  // useChat hook manages the chat state and handlers
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch">
      <div className="flex flex-col flex-grow max-h-screen overflow-scroll">
        {messages.map((m) => (
          // The whitespace prewrap class is used to preserve whitespace and indentation in the chat messages
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      {/* try installing the shadcn input component */}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
