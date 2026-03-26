// Phase 4: Database seed file for development
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // Create Admin User
  // ============================================
  const adminPassword = "admin123"; // Default password for development
  const adminPasswordHash = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: "admin@spx.com" },
    update: {},
    create: {
      email: "admin@spx.com",
      passwordHash: adminPasswordHash,
      name: "SPX Admin",
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Created admin user:", admin.email);
  console.log("   Password (dev only):", adminPassword);

  // ============================================
  // Create Editor User
  // ============================================
  const editorPassword = "editor123"; // Default password for development
  const editorPasswordHash = await hashPassword(editorPassword);

  const editor = await prisma.user.upsert({
    where: { email: "editor@spx.com" },
    update: {},
    create: {
      email: "editor@spx.com",
      passwordHash: editorPasswordHash,
      name: "SPX Editor",
      role: "EDITOR",
      isActive: true,
    },
  });

  console.log("✅ Created editor user:", editor.email);
  console.log("   Password (dev only):", editorPassword);

  // ============================================
  // Create Author
  // ============================================
  const author = await prisma.author.upsert({
    where: { slug: "spx-research-team" },
    update: {},
    create: {
      name: "SPX Research Team",
      slug: "spx-research-team",
      bio: "Institutional research and strategic analysis from the SPX team.",
      email: "research@spx.com",
    },
  });

  console.log("✅ Created author:", author.name);

  // ============================================
  // Create Categories
  // ============================================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "strategy" },
      update: {},
      create: {
        name: "Strategy",
        slug: "strategy",
        description: "Strategic research and analysis",
      },
    }),
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "Technology",
        slug: "technology",
        description: "Technology trends and systems thinking",
      },
    }),
    prisma.category.upsert({
      where: { slug: "editorial" },
      update: {},
      create: {
        name: "Editorial",
        slug: "editorial",
        description: "Editorial perspectives and frameworks",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.map((c) => c.name).join(", "));

  // ============================================
  // Create Tags
  // ============================================
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "systems-thinking" },
      update: {},
      create: {
        name: "Systems Thinking",
        slug: "systems-thinking",
        description: "Understanding organizational complexity",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "research" },
      update: {},
      create: {
        name: "Research",
        slug: "research",
        description: "In-depth research and analysis",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "framework" },
      update: {},
      create: {
        name: "Framework",
        slug: "framework",
        description: "Strategic frameworks and methodologies",
      },
    }),
  ]);

  console.log("✅ Created tags:", tags.map((t) => t.name).join(", "));

  // ============================================
  // Create Sample Insight
  // ============================================
  const insight = await prisma.insight.upsert({
    where: { slug: "welcome-to-spx" },
    update: {},
    create: {
      slug: "welcome-to-spx",
      title: "Welcome to SPX",
      excerpt:
        "An introduction to SPX's institutional editorial and systems-layer capabilities.",
      contentJson: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Introduction" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Welcome to SPX. This is a sample insight article demonstrating the Tiptap JSON content structure.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Our Approach" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "SPX combines institutional-grade research with systems thinking to deliver clarity in complex environments.",
              },
            ],
          },
        ],
      },
      contentHtml:
        "<h2>Introduction</h2><p>Welcome to SPX. This is a sample insight article demonstrating the Tiptap JSON content structure.</p><h2>Our Approach</h2><p>SPX combines institutional-grade research with systems thinking to deliver clarity in complex environments.</p>",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: author.id,
      categoryId: categories[0].id,
      createdById: admin.id,
      metaTitle: "Welcome to SPX | Insights",
      metaDescription: "An introduction to SPX's institutional editorial and systems-layer capabilities.",
    },
  });

  console.log("✅ Created insight:", insight.id, insight.title);

  // ============================================
  // Link Tags to Insight (idempotent)
  // ============================================
  for (const tag of tags.slice(0, 2)) {
    await prisma.insightTag.upsert({
      where: {
        insightId_tagId: {
          insightId: insight.id,
          tagId: tag.id,
        },
      },
      update: {},
      create: {
        insightId: insight.id,
        tagId: tag.id,
      },
    });
  }

  console.log("✅ Linked tags to insight");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📝 Login credentials (development only):");
  console.log("   Admin: admin@spx.com / admin123");
  console.log("   Editor: editor@spx.com / editor123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
