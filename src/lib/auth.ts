import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/tables";
import type { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    // @ts-expect-error: type error
    usersTable: users, 
    // @ts-expect-error: type error
    accountsTable: accounts,
    // @ts-expect-error: type error
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ? Number(user.id) : (token?.sub ? Number(token.sub) : 0);
        // Add displayName to session for easy access
        if (user) {
          session.user.displayName = user.displayName;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database" as const,
  },
};
