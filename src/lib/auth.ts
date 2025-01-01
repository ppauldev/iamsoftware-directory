import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from "./prisma";
import { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      }
    }),
  },
}; 