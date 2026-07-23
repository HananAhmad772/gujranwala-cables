/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../app/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// const categoriesData = [
//   {
//     name: "Building Wires",
//     slug: "building-wires",
//     description: "Flexible PVC insulated wires for residential and commercial circuits.",
//     isActive: true,
//   },
//   {
//     name: "Power Cables",
//     slug: "power-cables",
//     description: "Low-voltage and heavy-duty conductors for reliable distribution.",
//     isActive: true,
//   },
//   {
//     name: "Fire Resistant",
//     slug: "fire-resistant",
//     description: "Safer cabling options for critical areas and high-occupancy buildings.",
//     isActive: true,
//   },
//   {
//     name: "Lighting & Control",
//     slug: "lighting-control",
//     description: "Practical wires for panels, controls, fixtures, and daily site work.",
//     isActive: true,
//   },
// ];

// const brandsData = [
//   {
//     name: "GEW ProLine",
//     slug: "gew-proline",
//     description: "Premium wires for commercial-grade installation teams.",
//     isActive: true,
//   },
//   {
//     name: "GEW PowerCore",
//     slug: "gew-powercore",
//     description: "Heavy-duty power cable portfolio for demanding loads.",
//     isActive: true,
//   },
//   {
//     name: "GEW SafeFlex",
//     slug: "gew-safeflex",
//     description: "Safety-focused flexible wiring for critical building zones.",
//     isActive: true,
//   },
// ];

// const productsData = [
//   {
//     name: "Premium Copper Building Wire",
//     slug: "premium-copper-building-wire",
//     description: "A dependable building wire range designed for contractors who need clean stripping, steady insulation quality, and predictable current carrying performance.",
//     price: 150.00,
//     stockStatus: "IN_STOCK",
//     isActive: true,
//     featuredImage: "/uploads/placeholders/product-copper-wire.jpg",
//     specs: [
//       { label: "Conductor", value: "Annealed copper" },
//       { label: "Voltage", value: "450/750V" },
//       { label: "Insulation", value: "PVC compound" }
//     ],
//     brandSlug: "gew-proline",
//     categorySlug: "building-wires",
//   },
//   {
//     name: "Industrial Low Voltage Cable",
//     slug: "industrial-low-voltage-cable",
//     description: "Designed for practical power distribution where mechanical durability, conductor integrity, and predictable supply are essential.",
//     price: 450.00,
//     stockStatus: "IN_STOCK",
//     isActive: true,
//     featuredImage: "/uploads/placeholders/product-low-voltage-cable.jpg",
//     specs: [
//       { label: "Cores", value: "2C to 4C" },
//       { label: "Voltage", value: "0.6/1kV" },
//       { label: "Sheath", value: "PVC outer sheath" }
//     ],
//     brandSlug: "gew-powercore",
//     categorySlug: "power-cables",
//   },
//   {
//     name: "Fire Safe Circuit Cable",
//     slug: "fire-safe-circuit-cable",
//     description: "A safety-forward cable option for buildings where circuit continuity and reduced flame spread are key design requirements.",
//     price: 650.00,
//     stockStatus: "IN_STOCK",
//     isActive: true,
//     featuredImage: "/uploads/placeholders/product-fire-safe-cable.jpg",
//     specs: [
//       { label: "Use", value: "Critical circuits" },
//       { label: "Design", value: "Low smoke option" },
//       { label: "Testing", value: "Flame spread checks" }
//     ],
//     brandSlug: "gew-safeflex",
//     categorySlug: "fire-resistant",
//   },
// ];

// const blogsData = [
//   {
//     title: "How to choose cable size for commercial sites",
//     slug: "choosing-cable-size-for-commercial-sites",
//     excerpt: "A practical view of load, voltage drop, routing, and safety margins.",
//     content: "Cable sizing starts with the actual load profile, not only the connected equipment list. Contractors should consider current demand, future expansion, installation method, and ambient temperature.\n\nVoltage drop and route length can change the final selection. Good documentation and product markings make installation teams faster and reduce rework on site.",
//     featuredImage: "/uploads/placeholders/blog-cable-sizing.jpg",
//     status: "PUBLISHED",
//     publishedAt: new Date("2026-06-18T00:00:00Z"),
//   },
//   {
//     title: "Why insulation quality matters in building wires",
//     slug: "why-insulation-quality-matters",
//     excerpt: "Insulation consistency affects safety, handling, and long-term reliability.",
//     content: "Good insulation is more than a colored outer layer. It supports electrical safety, helps wires survive site handling, and makes everyday installation smoother.\n\nBatch consistency, visible markings, and clean stripping behavior all help contractors deliver cleaner work with fewer delays.",
//     featuredImage: "/uploads/placeholders/blog-insulation-quality.jpg",
//     status: "DRAFT",
//   },
//   {
//     title: "Buying quality wires from authorized brands",
//     slug: "buying-quality-wires-from-authorized-brands",
//     excerpt: "A practical look at brand trust, specifications, and buying confidence.",
//     content: "Buying from trusted electrical brands helps customers compare specifications, understand product use, and avoid low-quality alternatives.\n\nFor buyers, a reliable supplier should provide clear product details, responsive service, and suitable options for both retail and wholesale needs.",
//     featuredImage: "/uploads/placeholders/blog-buying-guide.jpg",
//     status: "PUBLISHED",
//     publishedAt: new Date("2026-04-12T00:00:00Z"),
//   },
// ];

// const reviewsData = [
//   {
//     name: "Bilal Ahmed",
//     email: "bilal.ahmed@example.com",
//     rating: 5,
//     comment: "The wire finish and packaging make site work easier. Our teams can identify ratings quickly and installation stays smooth.",
//     status: "APPROVED",
//   },
//   {
//     name: "Sara Malik",
//     email: "sara.malik@example.com",
//     rating: 5,
//     comment: "Their product guidance is practical and the supply response is dependable for ongoing commercial projects.",
//     status: "APPROVED",
//   },
//   {
//     name: "Usman Rauf",
//     email: "usman.rauf@example.com",
//     rating: 5,
//     comment: "We value consistent specs and clear communication. It helps our maintenance and expansion work move with confidence.",
//     status: "APPROVED",
//   },
// ];

// const faqsData = [
//   {
//     question: "Do you sell both copper and aluminium cables?",
//     answer: "Yes. Our catalog includes premium wire and cable ranges for retail, wholesale, and project supply from authorized brands.",
//     sortOrder: 1,
//   },
//   {
//     question: "Can contractors request technical guidance?",
//     answer: "Yes. Our sales team can help with product selection, quantity planning, and supply timing for active jobs.",
//     sortOrder: 2,
//   },
//   {
//     question: "Do you support wholesale and retail orders?",
//     answer: "Yes. We support both small retail purchases and larger wholesale requirements for dealers, contractors, and project buyers.",
//     sortOrder: 3,
//   },
// ];

async function main() {
  // 1. Seed Admin
  const email = "admin@gmail.com";
  const password = "password@123";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Admin",
      passwordHash,
      role: "admin",
    },
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "admin",
    },
  });
  console.log("Seeded admin user:", admin.email);

  // // 2. Clear out existing dynamic tables to prevent duplication on multiple runs
  // await prisma.review.deleteMany({});
  // await prisma.fAQ.deleteMany({});
  // await prisma.blogPost.deleteMany({});
  // await prisma.productImage.deleteMany({});
  // await prisma.product.deleteMany({});
  // await prisma.category.deleteMany({});
  // await prisma.brand.deleteMany({});
  // console.log("Cleared existing DB rows.");

  // // 3. Seed Categories
  // const categoryIdMap = {};
  // for (const cat of categoriesData) {
  //   const createdCat = await prisma.category.create({
  //     data: cat,
  //   });
  //   categoryIdMap[cat.slug] = createdCat.id;
  // }
  // console.log(`Seeded ${categoriesData.length} categories.`);

  // // 4. Seed Brands
  // const brandIdMap = {};
  // for (const brand of brandsData) {
  //   const createdBrand = await prisma.brand.create({
  //     data: brand,
  //   });
  //   brandIdMap[brand.slug] = createdBrand.id;
  // }
  // console.log(`Seeded ${brandsData.length} brands.`);

  // // 5. Seed Products
  // for (const prod of productsData) {
  //   const { brandSlug, categorySlug, specs, ...prodFields } = prod;
  //   const brandId = brandIdMap[brandSlug];
  //   const categoryId = categoryIdMap[categorySlug];

  //   if (!brandId || !categoryId) {
  //     console.warn(`Could not find brand or category for product slug: ${prod.slug}`);
  //     continue;
  //   }

  //   await prisma.product.create({
  //     data: {
  //       ...prodFields,
  //       brandId,
  //       categoryId,
  //       specs,
  //       images: {
  //         create: [
  //           {
  //             imageUrl: prodFields.featuredImage,
  //             altText: prodFields.name,
  //             isPrimary: true,
  //             sortOrder: 0,
  //           }
  //         ]
  //       }
  //     },
  //   });
  // }
  // console.log(`Seeded ${productsData.length} products.`);

  // // 6. Seed Blogs
  // for (const blog of blogsData) {
  //   await prisma.blogPost.create({
  //     data: blog,
  //   });
  // }
  // console.log(`Seeded ${blogsData.length} blog posts.`);

  // // 7. Seed Reviews
  // for (const review of reviewsData) {
  //   await prisma.review.create({
  //     data: review,
  //   });
  // }
  // console.log(`Seeded ${reviewsData.length} reviews.`);

  // // 8. Seed FAQs
  // for (const faq of faqsData) {
  //   await prisma.fAQ.create({
  //     data: faq,
  //   });
  // }
  // console.log(`Seeded ${faqsData.length} FAQs.`);

  // 9. Seed / upsert SiteSettings with correct social links and address
  await prisma.siteSettings.upsert({
    where: { id: "global-settings" },
    update: {
      companyName: "Gujranwala Electric Cables",
      address: "New Bilal Ganj Market, Sheikhupura Road, Gujranwala, Punjab, Pakistan",
      phone: "+92 310 232432",
      whatsappNumber: "+92 310 232432",
      email: "admin@gujranwalaelectric.com",
      facebookUrl: "https://www.facebook.com/profile.php?id=61591522142534&mibextid=wwXIfr&mibextid=wwXIfr",
      instagramUrl: "https://www.instagram.com/gujranwalaelectric?igsh=NWd2NTJrMHV1eGRq&utm_source=qr",
      linkedinUrl: null,
      youtubeUrl: "https://youtube.com/@gecgujranwalaelectriccables?si=_pUb3pXCbn2l63V1",
      mapEmbedUrl: "https://www.google.com/maps?q=New+Bilal+Ganj+Market%2C+Sheikhupura+Road%2C+Gujranwala%2C+Pakistan&output=embed",
    },
    create: {
      id: "global-settings",
      companyName: "Gujranwala Electric Cables",
      address: "New Bilal Ganj Market, Sheikhupura Road, Gujranwala, Punjab, Pakistan",
      phone: "+92 310 232432",
      whatsappNumber: "+92 310 232432",
      email: "admin@gujranwalaelectric.com",
      facebookUrl: "https://www.facebook.com/profile.php?id=61591522142534&mibextid=wwXIfr&mibextid=wwXIfr",
      instagramUrl: "https://www.instagram.com/gujranwalaelectric?igsh=NWd2NTJrMHV1eGRq&utm_source=qr",
      linkedinUrl: null,
      youtubeUrl: "https://youtube.com/@gecgujranwalaelectriccables?si=_pUb3pXCbn2l63V1",
      tiktokUrl: "https://www.tiktok.com/@gujranwala.electri?_r=1&_t=ZS-97ppTG8DAvp",
      mapEmbedUrl: "https://www.google.com/maps?q=New+Bilal+Ganj+Market%2C+Sheikhupura+Road%2C+Gujranwala%2C+Pakistan&output=embed",
    },
  });
  console.log("Seeded SiteSettings.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
