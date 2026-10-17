import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  migrations: {
    path: "prisma/migration",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
