// db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/tables';

const sql = neon(process.env.DATABASE_URL!); // HTTP query fn
export const db = drizzle(sql, { schema });
