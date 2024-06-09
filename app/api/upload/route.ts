import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  // Validate filename presence and ensure it is a string
  if (typeof filename !== "string") {
    return new NextResponse("Filename is required", { status: 400 });
  }

  // Ensure request.body is not null and is a ReadableStream
  if (!(request.body instanceof ReadableStream)) {
    return new NextResponse("Invalid or missing file content", { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
