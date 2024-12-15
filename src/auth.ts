import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const neon = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Resend, Google],
  pages: {
    signIn: "/signin",
  },
});
