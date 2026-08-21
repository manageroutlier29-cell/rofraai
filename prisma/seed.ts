import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting ROFRAAI database seed...");

  const passwordHash = await bcrypt.hash("Admin123!", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@rofraai.com",
    },
    update: {},
    create: {
      email: "admin@rofraai.com",
      passwordHash,
      firstName: "ROFRAAI",
      lastName: "Admin",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin: ${admin.email}`);

  const clientPasswordHash = await bcrypt.hash("Client123!", 12);

  const client = await prisma.user.upsert({
    where: {
      email: "client@rofraai.com",
    },
    update: {},
    create: {
      email: "client@rofraai.com",
      passwordHash: clientPasswordHash,
      firstName: "Demo",
      lastName: "Client",
      role: "CLIENT",
      status: "ACTIVE",
      clientProfile: {
        create: {
          companyName: "ROFRAAI Demo Client",
          description: "Demo client account for testing the marketplace.",
        },
      },
    },
  });

  console.log(`✅ Client: ${client.email}`);

  const workerPasswordHash = await bcrypt.hash("Worker123!", 12);

  const worker = await prisma.user.upsert({
    where: {
      email: "worker@rofraai.com",
    },
    update: {},
    create: {
      email: "worker@rofraai.com",
      passwordHash: workerPasswordHash,
      firstName: "Demo",
      lastName: "Worker",
      role: "WORKER",
      status: "ACTIVE",
      workerProfile: {
        create: {
          bio: "Demo ROFRAAI marketplace worker.",
          skills: "AI Evaluation, Data Annotation, Research, Finance",
          country: "Kenya",
          experience: "2 years",
        },
      },
    },
  });

  console.log(`✅ Worker: ${worker.email}`);

  await prisma.workerWallet.upsert({
    where: {
      workerId: worker.id,
    },
    update: {},
    create: {
      workerId: worker.id,
    },
  });

  await prisma.workerAccess.upsert({
    where: {
      workerId: worker.id,
    },
    update: {},
    create: {
      workerId: worker.id,
      freeTaskLimit: 3,
      tasksClaimed: 0,
      tasksCompleted: 0,
      isUnlocked: false,
      unlockFee: 5.00,
    },
  });

  console.log(`✅ Worker wallet and marketplace access ready`);

  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      title: "AI Response Evaluation Project",
      description:
        "Evaluate AI-generated responses for accuracy, relevance, clarity, and reasoning quality.",
      category: "AI Evaluation",
      budget: 500,
      status: "OPEN",
    },
  });

  console.log(`✅ Project created: ${project.title}`);

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        projectId: project.id,
        title: "Evaluate AI Responses",
        description:
          "Review AI-generated answers and determine whether they are accurate, relevant, and well-written.",
        category: "AI Evaluation",
        reward: 5,
        status: "AVAILABLE",
      },
    }),

    prisma.task.create({
      data: {
        projectId: project.id,
        title: "Financial Reasoning Evaluation",
        description:
          "Evaluate AI answers to finance and economics questions and identify reasoning errors.",
        category: "Finance",
        reward: 8,
        status: "AVAILABLE",
      },
    }),

    prisma.task.create({
      data: {
        projectId: project.id,
        title: "Data Quality Review",
        description:
          "Review structured AI training data for accuracy, consistency, and completeness.",
        category: "Data Quality",
        reward: 4,
        status: "AVAILABLE",
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} marketplace tasks`);

  console.log("");
  console.log("🎉 ROFRAAI database seed completed successfully!");
  console.log("");
  console.log("Demo accounts:");
  console.log("Admin:  admin@rofraai.com / Admin123!");
  console.log("Client: client@rofraai.com / Client123!");
  console.log("Worker: worker@rofraai.com / Worker123!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
