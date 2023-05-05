import { prisma } from "../db/client";
import fs from "fs";
async function convertTablesToJSON() {
  const rows = await prisma.$queryRaw`SELECT * FROM "Anime"`;

  const json = JSON.stringify(rows, null, 2);
  fs.writeFileSync("exporttest2.json", json, "utf8");

  // You can do whatever you want with the JSON here, e.g. write it to a file.

  await prisma.$disconnect();
}
convertTablesToJSON().catch((error) => {
  console.error(error);
  process.exit(1);
});
