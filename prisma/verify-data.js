/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../app/generated/prisma/client");

const prisma = new PrismaClient();

async function verifyData() {
  console.log("🔍 Verifying database state...");
  console.log("");

  try {
    // Check admin users
    const adminUsers = await prisma.adminUser.findMany();
    console.log(`📊 Admin Users: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.email} (${admin.name})`);
    });
    console.log("");

    // Check site settings
    const siteSettings = await prisma.siteSettings.findMany();
    console.log(`📊 Site Settings: ${siteSettings.length}`);
    siteSettings.forEach(setting => {
      console.log(`   - Company: ${setting.companyName}`);
      console.log(`   - Phone: ${setting.phone}`);
      console.log(`   - WhatsApp: ${setting.whatsappNumber}`);
    });
    console.log("");

    // Check other tables
    const products = await prisma.product.count();
    const brands = await prisma.brand.count();
    const categories = await prisma.category.count();
    const blogs = await prisma.blogPost.count();
    const reviews = await prisma.review.count();
    const faqs = await prisma.fAQ.count();
    const contacts = await prisma.contactSubmission.count();
    const images = await prisma.productImage.count();

    console.log("📊 Other Tables:");
    console.log(`   - Products: ${products}`);
    console.log(`   - Brands: ${brands}`);
    console.log(`   - Categories: ${categories}`);
    console.log(`   - Blog Posts: ${blogs}`);
    console.log(`   - Reviews: ${reviews}`);
    console.log(`   - FAQs: ${faqs}`);
    console.log(`   - Contact Submissions: ${contacts}`);
    console.log(`   - Product Images: ${images}`);
    console.log("");

    if (products === 0 && brands === 0 && categories === 0 && blogs === 0 && 
        reviews === 0 && faqs === 0 && contacts === 0 && images === 0) {
      console.log("✅ All seeded data has been successfully cleared!");
    } else {
      console.log("⚠️  Some data still remains in the database.");
    }

  } catch (error) {
    console.error("❌ Error during verification:", error);
    throw error;
  }
}

verifyData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
