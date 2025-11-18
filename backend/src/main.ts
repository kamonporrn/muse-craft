import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { seedDatabase } from "./database/seed";
import { json } from "express";
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    console.error(`[${request.method}] ${request.url} - Error:`, exception);

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV === 'development' && exception instanceof Error && { stack: exception.stack }),
    });
  }
}

async function bootstrap() {
  try {
    // Seed database on startup
    seedDatabase();

    const app = await NestFactory.create(AppModule);
    
    // Increase body size limit to 10MB (for base64 images)
    app.use(json({ limit: '10mb' }));
    
    // Enable CORS for frontend
    app.enableCors({
      origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
      credentials: true,
    });

    // Global exception filter for better error handling
    app.useGlobalFilters(new GlobalExceptionFilter());

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`📁 Database files location: ./database/data/`);
    console.log(`💾 Backup files location: ./database/backups/`);
    console.log(`📦 Body size limit: 10MB`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
