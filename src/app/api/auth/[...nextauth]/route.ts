import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// @ts-expect-error: type error
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
