import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./core/filters/exceptionloggingfilter";
import { HttpErrorFilter } from "./core/filters/httperrorfilter";
import { DatabaseExceptionFilter } from "./core/filters/database-exception.filter";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import { ConfigModule, ConfigService } from "@nestjs/config";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log("Database Module Loaded",configService.get<string>("MONGO_URL"));
  const allowedHosts = [
    "pi-audit-app.radpretation.ai",
    "https://pi-audit-app.radpretation.ai",
    
    "localhost:8000",
    "http://localhost:8000"
  ];

  app.use((req, res, next) => {
    const incomingHost = req.headers.host?.toLowerCase();

    if (!incomingHost || !allowedHosts.includes(incomingHost)) {
      // Reject the request if host header is not allowed
      res.status(400).send("Invalid Host Header");
    } else {
      next();
    }
  });

  // Global validation pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const allowedOrigins = [
    "http://localhost:5173",
    "https://pi-audit-app.radpretation.ai",
  ];

  app.use((req, res, next) => {
    const origin = req.headers.origin || "";
    const referer = req.headers.referer || "";

    const isAllowedOrigin = allowedOrigins.some((allowed) =>
      origin.startsWith(allowed)
    );
    const isAllowedReferer = allowedOrigins.some((allowed) =>
      referer.startsWith(allowed)
    );

    if ((origin && !isAllowedOrigin) || (referer && !isAllowedReferer)) {
      console.warn(
        "Blocked request from invalid origin or referer:",
        origin,
        referer
      );
      return res.status(403).send("Forbidden: Invalid Origin or Referer");
    }

    next();
  });

  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
    })
  ); // Security headers
  app.use(compression()); // Response compression
  // app.enableCors();
  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies (important for authentication)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  });
  // Set the global prefix
  app.setGlobalPrefix("api");
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpErrorFilter(),
    new DatabaseExceptionFilter()
  );

  // app.use
  Logger.log(`Backend is running on: http://localhost:${process.env.PORT}`);
  console.log("NestJS application started successfully.");
  console.log("process.env display", process.env);
  await app.listen(process.env.PORT);
}
bootstrap();
