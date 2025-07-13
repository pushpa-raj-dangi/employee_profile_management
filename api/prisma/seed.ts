import { prisma } from "../src/prisma";
import { hashPassword } from "../src/utils/auth/auth";

async function main() {


  await prisma.user.createMany({
    data: [
      {
        email: "systemadmin@gmail.com",
        password: await hashPassword("Test@123"),
        role: "SYSTEM_ADMIN",
      },
      {
        email: "admin@gmail.com",
        password: await hashPassword("Test@123"),
        role: "MANAGER",
      },
      {
        id: "user-id-123",
        email: "employee@gmail.com",
        password: await hashPassword("Test@123"),
        role: "GENERAL_EMPLOYEE",
      },
    ],
    skipDuplicates: true,
  });

  // Seed companies
  await prisma.company.create({
    data: {
      id: "company-id-123",
      name: "Example Corp",
      address: "Kathmandu, Nepal",
      email: "info@example.com",
      website: "www.example.com",
      zipCode: "44600",
      phoneNumber: "1234567890",
      establishmentDate: new Date("2020-01-01"),
      remarks: "Leading company in tech solutions",
      images: ["image1.jpg", "image2.jpg"],
    },
  });

  await prisma.companyUser.create({
    data: {
      userId: "user-id-123",
      companyId: "company-id-123",
    },
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
