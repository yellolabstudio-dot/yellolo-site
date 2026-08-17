import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  { id: "p1", name: "Cinematic Graphic Pack", description: "Полный набор кинематографических элементов: оверлеи, текстуры, ленс флеры и цветокоррекция", price: 29.99, category: "editing", subcategory: "graphic-pack", imageUrl: "https://cdn.abacus.ai/images/8a0bde76-f10d-46a0-81af-5e8fc2dd18f2.png" },
  { id: "p2", name: "Neon Graphic Pack", description: "Неоновые эффекты, свечения и графические элементы в неоновом стиле", price: 24.99, category: "editing", subcategory: "graphic-pack", imageUrl: "https://cdn.abacus.ai/images/f5d93b52-1e9b-4345-8122-8d8ba8e1a0a5.png" },
  { id: "p3", name: "Smooth Transitions Pack", description: "50+ плавных переходов для Premiere Pro и After Effects", price: 19.99, category: "editing", subcategory: "transition", imageUrl: "https://cdn.abacus.ai/images/5c3fe040-505a-4c15-a3c6-a7c21d3aa9e0.png" },
  { id: "p4", name: "Glitch Transitions", description: "Динамичные глитч-переходы с эффектом искажения", price: 14.99, category: "editing", subcategory: "transition", imageUrl: "https://cdn.abacus.ai/images/23056746-ab19-4c08-9638-0d059bc74228.png" },
  { id: "p5", name: "Instagram Reels Pack", description: "Шаблоны для Instagram Reels: сторис, анимации, эффекты", price: 17.99, category: "editing", subcategory: "reels", imageUrl: "https://cdn.abacus.ai/images/11345224-6072-41cc-b287-9e3daf22e9e2.png" },
  { id: "p6", name: "Epic Intro & Opener", description: "Эпические вступления с 3D-анимацией и кинематографическими эффектами", price: 34.99, category: "editing", subcategory: "intro-opener", imageUrl: "https://cdn.abacus.ai/images/389747d2-1ea7-471c-893c-8461b8acea12.png" },
  { id: "p7", name: "Modern Titles Collection", description: "Коллекция современных анимированных титров и текстовых эффектов", price: 22.99, category: "editing", subcategory: "titles", imageUrl: "https://cdn.abacus.ai/images/36ba8cc5-5aba-4cf0-a202-2ddbf2254227.png" },
  { id: "p8", name: "Device Mock-Up Pack", description: "3D мокапы устройств: iPhone, MacBook, iPad для презентаций", price: 27.99, category: "editing", subcategory: "mockup", imageUrl: "https://cdn.abacus.ai/images/8df12237-0419-4549-848f-607236e9db9a.png" },
  { id: "p9", name: "TikTok Reels Bundle", description: "Полный набор для создания вирального контента для TikTok", price: 19.99, category: "editing", subcategory: "reels", imageUrl: "https://cdn.abacus.ai/images/ecb0a5b6-1f46-47a1-b62c-592d00143b8c.png" },
];

const videos = [
  { id: "v1", title: "Рекламный ролик для Tech Startup", description: "Профессиональное рекламное видео", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", sortOrder: 1 },
  { id: "v2", title: "Корпоративная презентация", description: "Корпоративное видео с мотивационным сюжетом", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", sortOrder: 2 },
  { id: "v3", title: "Продуктовое видео для E-commerce", description: "Презентация продукта для онлайн-магазина", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", sortOrder: 3 },
];

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash("johndoe123", 12);
  await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: { email: "john@doe.com", name: "Admin", password: adminPassword, role: "admin" },
  });

  const adminPassword2 = await bcrypt.hash("YellolabAdmin2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@yellolab.studio" },
    update: {},
    create: { email: "admin@yellolab.studio", name: "Yellolab Admin", password: adminPassword2, role: "admin" },
  });

  // Seed products
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { name: p.name, description: p.description, price: p.price, imageUrl: p.imageUrl, subcategory: p.subcategory },
      create: { ...p, active: true, featured: false },
    });
  }

  // Seed videos
  for (const v of videos) {
    await prisma.video.upsert({
      where: { id: v.id },
      update: { title: v.title, description: v.description, youtubeUrl: v.youtubeUrl },
      create: { ...v, active: true, featured: false },
    });
  }

  console.log("Сидирование завершено");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
