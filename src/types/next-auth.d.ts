import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      displayName?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    displayName?: string | null;
  }
}