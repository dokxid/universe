import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const connectionString = `postgresql://${env("POSTGRES_USER")}:${env("POSTGRES_PASSWORD")}@${env("POSTGRES_HOST")}/${env("POSTGRES_DB")}`

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx src/data/scripts/seed-production-script.ts",
    },
    engine: "classic",
    datasource: {
        url: connectionString,
    },
});
