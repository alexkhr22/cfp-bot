import { prisma } from "../libs/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      tags: ["ai", "nlp"]
    }
  });

  console.log(user);
}

main();
