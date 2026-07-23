/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../app/generated/prisma/client");

const prisma = new PrismaClient();

async function clearData() {
  console.log("🗑️  Starting database cleanup...");
  console.log("⚠️  This will delete all data except the admin user.");
  console.log("");

  try {
    // Delete in correct order to respect foreign key constraints
    
    // 1. Delete product images first (depends on products)
    const deletedImages = await prisma.productImage.deleteMany({});
    console.log(`✓ Deleted ${deletedImages.count} product images`);

    // 2. Delete products (depends on brands and categories)
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✓ Deleted ${deletedProducts.count} products`);

    // 3. Delete brands (no dependencies)
    const deletedBrands = await prisma.brand.deleteMany({});
    console.log(`✓ Deleted ${deletedBrands.count} brands`);

    // 4. Delete categories (no dependencies)
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`✓ Deleted ${deletedCategories.count} categories`);

    // 5. Delete blog posts (no dependencies)
    const deletedBlogs = await prisma.blogPost.deleteMany({});
    console.log(`✓ Deleted ${deletedBlogs.count} blog posts`);

    // 6. Delete reviews (no dependencies)
    const deletedReviews = await prisma.review.deleteMany({});
    console.log(`✓ Deleted ${deletedReviews.count} reviews`);

    // 7. Delete FAQs (no dependencies)
    const deletedFAQs = await prisma.fAQ.deleteMany({});
    console.log(`✓ Deleted ${deletedFAQs.count} FAQs`);

    // 8. Delete contact submissions (no dependencies)
    const deletedContacts = await prisma.contactSubmission.deleteMany({});
    console.log(`✓ Deleted ${deletedContacts.count} contact submissions`);

    console.log("");
    console.log("✅ Database cleanup completed successfully!");
    console.log("ℹ️  Admin user has been preserved.");
    console.log("ℹ️  Site settings have been preserved.");

  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
}

clearData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
