import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    displayName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    displayName?: string | null;
  }
}
