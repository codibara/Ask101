import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/tables";

export const authOptions = {
  adapter: DrizzleAdapter(db, {
    // @ts-ignore
    usersTable: users, 
    // @ts-ignore
    accountsTable: accounts,
    // @ts-ignore
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
    // @ts-ignore
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub;
        // Add displayName to session for easy access
        if (user) {
          session.user.displayName = user.displayName;
        }
      }
      return session;
    },
    // @ts-ignore
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
    strategy: "database",
  },
};
