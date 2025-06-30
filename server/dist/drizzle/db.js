"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "../server/.env" });
const neon_http_1 = require("drizzle-orm/neon-http");
(0, dotenv_1.config)({ path: ".env" }); // or .env.local
exports.db = (0, neon_http_1.drizzle)(process.env.DRIZZLE_DATABASE_URL);
