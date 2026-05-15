import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

let prisma;

if (process.env.NODE_ENV === "production") {
  // In production, we use the adapter for better performance and connection pooling in serverless
  try {
    const url = new URL(databaseUrl);
    const pool = mariadb.createPool({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.substring(1),
      connectionLimit: 5,
      // Add SSL if needed by the provider (common for external MySQL)
      ssl: databaseUrl.includes("ssl") ? { rejectUnauthorized: true } : undefined
    });
    
    const adapter = new PrismaMariaDb(pool);
    prisma = new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma with MariaDB adapter, falling back to default:", error);
    prisma = new PrismaClient();
  }
} else {
  // In development, use a global variable to prevent multiple instances
  if (!global.prisma) {
    try {
      const url = new URL(databaseUrl);
      const pool = mariadb.createPool({
        host: url.hostname || "localhost",
        port: parseInt(url.port) || 3306,
        user: decodeURIComponent(url.username) || "root",
        password: decodeURIComponent(url.password) || "",
        database: url.pathname.substring(1),
        connectionLimit: 5,
      });
      const adapter = new PrismaMariaDb(pool);
      global.prisma = new PrismaClient({ adapter });
    } catch (error) {
      global.prisma = new PrismaClient();
    }
  }
  prisma = global.prisma;
}

export { prisma };
