import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const prismaConfig = {
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "bun prisma/seed.ts",
  },
};

export default prismaConfig;
