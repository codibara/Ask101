import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      displayName?: string | null;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    displayName?: string | null;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    displayName?: string | null;
  }
}
