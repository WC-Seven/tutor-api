require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.create({
    data: {
      name: "Wellington",
      area: "TI",
      role: "Programador Node/React",
      level: "intermediate",
      goals: "Conversar em entrevistas tecnicas e dailies",
    },
  });

  console.log(
    JSON.stringify(
      {
        success: true,
        seededProfileId: profile.id.toString(),
        name: profile.name,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
