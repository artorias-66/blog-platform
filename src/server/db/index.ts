import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!, {
  max: 1,
  prepare: false,
});

export const db = drizzle(client, { schema });


