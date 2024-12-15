import { initSocket, NextApiResponseServerIO } from "@/lib/socket";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  initSocket(res);
  res.status(200).json({ message: "Socket server initialized" });
}

export const dynamic = "force-dynamic";
