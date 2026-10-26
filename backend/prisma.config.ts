import { definePrismaConfig } from "prisma/config";
import { defineConfig as definePostgresConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: definePostgresConfig({
    contract: "./prisma/schema.prisma",
    db: {
      connection: process.env.DATABASE_URL,
    },
  }),
});
