import { createServer } from "http";
import { NextResponse } from "next/server";
import { initSocket } from "@/lib/socket";

const server = createServer();
const io = initSocket(server);

export async function GET() {
  if (!io) {
    return new NextResponse("Socket.io server not initialized", {
      status: 500,
    });
  }

  return new NextResponse("Socket.io server running", { status: 200 });
}

export const dynamic = "force-dynamic";
