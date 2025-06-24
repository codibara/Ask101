import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/tables.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_pvo0ThR1DIYZ@ep-wispy-flower-a6w87ke0-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require!",
  },
});
