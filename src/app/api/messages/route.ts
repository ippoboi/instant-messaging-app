import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, receiverId } = await req.json();

    // Find or create conversation between the two users
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: session.user.id } } },
          { participants: { some: { id: receiverId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: session.user.id }, { id: receiverId }],
          },
        },
      });
    }

    if (!session.user?.id) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: conversation.id,
        senderId: session.user.id,
        receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        conversation: {
          participants: {
            some: { id: session.user.id },
          },
        },
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
