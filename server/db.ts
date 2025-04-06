import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = "postgres://neondb_owner:npg_veP8orq4laRg@ep-aged-morning-aclepu1u-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
