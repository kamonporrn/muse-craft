import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { seedDatabase } from "./database/seed";
import { json } from "express";

async function bootstrap() {
  // Seed database on startup
  seedDatabase();

  const app = await NestFactory.create(AppModule);
  
  // Increase body size limit to 10MB (for base64 images)
  app.use(json({ limit: '10mb' }));
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📁 Database files location: ./database/data/`);
  console.log(`💾 Backup files location: ./database/backups/`);
  console.log(`📦 Body size limit: 10MB`);
}
bootstrap();
