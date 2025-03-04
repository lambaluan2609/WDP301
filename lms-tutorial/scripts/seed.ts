const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Music" },
        { name: "Photography" },
        { name: "Fitness" },
        { name: "Accounting" },
        { name: "Computer Science" },
        { name: "Filming" },
        { name: "Engineering" },
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database categories:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
