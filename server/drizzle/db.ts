import { config } from "dotenv";
config({ path: "../server/.env" });

import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DRIZZLE_DATABASE_URL!);
