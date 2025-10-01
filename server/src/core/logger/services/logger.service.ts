import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { UserContext } from "../../contexts/user.context";
import { TenantContext } from "../../contexts/tenant.context";
import { TransactionContext } from "../../contexts/transaction.context";
import { RequestContext } from "src/core/contexts/request.context";

/**
 * Lightweight contextual logger that wraps the main logger
 */
export class ContextLogger {
  constructor(
    private readonly logger: LoggerService,
    private readonly context: string
  ) {}

  /**
   * Log at error level
   */
  error(
    message: any,
    trace?: string | Error,
    meta?: Record<string, any>
  ): void {
    this.logger.error(message, trace, { context: this.context, ...meta });
  }

  /**
   * Log at warn level
   */
  warn(message: any, meta?: Record<string, any>): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  /**
   * Log at info level
   */
  info(message: any, meta?: Record<string, any>): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  /**
   * Log at debug level
   */
  debug(message: any, meta?: Record<string, any>): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  /**
   * Log at verbose level
   */
  verbose(message: any, meta?: Record<string, any>): void {
    this.logger.verbose(message, { context: this.context, ...meta });
  }

  /**
   * Log at log level (alias for info)
   */
  log(message: any, meta?: Record<string, any>): void {
    this.logger.log(message, { context: this.context, ...meta });
  }
}

/**
 * Factory for getting logger instances without dependency injection
 * Used for DAOs and other places where DI isn't available
 */
export class LoggerFactory {
  private static instance: LoggerService | null = null;
  private static config: any = {};

  /**
   * Set configuration for the logger factory
   */
  static setConfig(config: any): void {
    this.config = config;
  }

  /**
   * Get the singleton logger service instance
   */
  static getInstance(): LoggerService {
    if (!this.instance) {
      this.instance = new LoggerService(this.config);
    }
    return this.instance;
  }

  /**
   * Get a contextual logger for a specific context
   */
  static getLogger(context: string): ContextLogger {
    return this.getInstance().forContext(context);
  }
}

/**
 * Main logger service implementing NestJS logger interface
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private defaultContext: string = "Application";
  private static instance: LoggerService;

  constructor(private readonly configService?: ConfigService) {
    if (!LoggerService.instance) {
      this.initializeLogger();
      LoggerService.instance = this;
    }
    return LoggerService.instance;
  }

  /**
   * Initialize Winston logger with appropriate transports and formats
   */
  private initializeLogger() {
    // Get config values
    const isProduction = this.getConfigValue("NODE_ENV") === "production";
    const logLevel = this.getConfigValue("LOG_LEVEL", "info");
    const logLevelConsole = this.getConfigValue("LOG_LEVEL_CONSOLE", "debug");
    const logLevelFile = this.getConfigValue("LOG_LEVEL_FILE", "info");
    const serviceName = this.getConfigValue("SERVICE_NAME", "api");
    const logDir = this.getConfigValue("LOG_DIR", "logs");

    // Define custom format that includes context data
    const customFormat = winston.format((info) => {
      // Try to attach context information from our application contexts
      try {
        // Get request context first
        const requestContext = RequestContext.getInstance();
        const requestData = requestContext.getRequestData();
        if (requestData) {
          info.requestId = requestData.requestId;
          info.url = requestData.url;
          info.method = requestData.method;
        }
        // Get user context
        const userContext = UserContext.getInstance();
        if (userContext) {
          info.userId = userContext.getUserId?.();
          // Add other user properties if available
          if (userContext.getUserId()) {
            info.username = userContext.getUserId();
          }
          if (userContext.getRoles) {
            info.roles = userContext.getRoles();
          }
        }

        // Get tenant context
        try {
          const tenantContext = TenantContext.getInstance();
          if (tenantContext) {
            info.tenantId = tenantContext.getTenantId?.();
          }
        } catch (err) {
          // Tenant context might not be available
        }

        // Get transaction context
        try {
          const transactionContext = TransactionContext.getInstance();
          if (transactionContext) {
            const session = transactionContext.getSession?.();
            if (session?.id) {
              info.transactionId =
                typeof session.id === "string"
                  ? session.id
                  : session.id.toString();
            }
          }
        } catch (err) {
          // Transaction context might not be available
        }
      } catch (e) {
        // Context services might not be available, which is fine
      }

      return info;
    });

    // Define log format for structured output
    const logFormat = winston.format.combine(
      customFormat(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    // Define console format for readable output
    const consoleFormat = winston.format.combine(
      customFormat(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.colorize(),
      winston.format.printf(
        ({
          level,
          message,
          timestamp,
          context,
          userId,
          tenantId,
          transactionId,
          ...rest
        }) => {
          // Format additional context info
          const userInfo = userId ? `[User:${userId}]` : "";
          const tenantInfo = tenantId ? `[Tenant:${tenantId}]` : "";
          const txInfo = transactionId ? `[Tx:${transactionId}]` : "";
          const contextInfo = context ? `[${context}]` : "";

          // Format message
          const formattedMessage = `${timestamp} ${level} ${contextInfo}${userInfo}${tenantInfo}${txInfo}: ${message}`;

          // Add any additional properties as JSON
          const restProps =
            Object.keys(rest).length > 0
              ? `\n${JSON.stringify(rest, null, 2)}`
              : "";

          return `${formattedMessage}${restProps}`;
        }
      )
    );

    // Configure transports
    const transports: winston.transport[] = [
      // Console transport (always enabled)
      new winston.transports.Console({
        level: logLevelConsole,
        format: consoleFormat,
      }),
    ];

    // Add file transports in production
    if (isProduction) {
      // Add daily rotate transport for all logs
      const fileTransport = new DailyRotateFile({
        level: logLevelFile,
        dirname: logDir,
        filename: "application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxFiles: "30d",
        maxSize: "20m",
        format: logFormat,
      });

      transports.push(fileTransport);

      // Add transport for error logs only
      const errorFileTransport = new DailyRotateFile({
        level: "error",
        dirname: logDir,
        filename: "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxFiles: "30d",
        maxSize: "20m",
        format: logFormat,
      });

      transports.push(errorFileTransport);
    }

    // Create the logger
    this.logger = winston.createLogger({
      level: logLevel,
      defaultMeta: {
        service: serviceName,
        environment: isProduction ? "production" : "development",
      },
      transports,
      exitOnError: false,
    });
  }

  /**
   * Get a configuration value
   */
  private getConfigValue(key: string, defaultValue?: any): any {
    if (this.configService && typeof this.configService.get === "function") {
      return this.configService.get(key, defaultValue);
    }
    return defaultValue;
  }

  /**
   * Get a contextual logger for the specified context
   */
  forContext(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }

  /**
   * Static method to get a contextual logger (for use in DAOs, etc)
   */
  static getLogger(context: string): ContextLogger {
    return LoggerFactory.getLogger(context);
  }

  /**
   * Set the default context for this logger
   */
  setContext(context: string): this {
    this.defaultContext = context;
    return this;
  }

  /**
   * Log at verbose level
   */
  verbose(message: any, ...optionalParams: any[]): void {
    this.printMessage("verbose", message, this.defaultContext, optionalParams);
  }

  /**
   * Log at debug level
   */
  debug(message: any, ...optionalParams: any[]): void {
    this.printMessage("debug", message, this.defaultContext, optionalParams);
  }

  /**
   * Log at log level (maps to 'info' in Winston)
   */
  log(message: any, ...optionalParams: any[]): void {
    this.printMessage("info", message, this.defaultContext, optionalParams);
  }

  /**
   * Log at info level
   */
  info(message: any, ...optionalParams: any[]): void {
    this.printMessage("info", message, this.defaultContext, optionalParams);
  }

  /**
   * Log at warn level
   */
  warn(message: any, ...optionalParams: any[]): void {
    this.printMessage("warn", message, this.defaultContext, optionalParams);
  }

  /**
   * Log at error level
   */
  error(
    message: any,
    trace?: string | Error,
    meta?: Record<string, any>
  ): void {
    // If the first param after message is a plain object, it's metadata not a trace
    if (trace && typeof trace !== "string" && !(trace instanceof Error)) {
      meta = trace as Record<string, any>;
      trace = undefined;
    }

    const contextData = this.extractContextData(meta);

    // If the message is an Error object, use its message and stack
    if (message instanceof Error) {
      this.logger.error(message.message, {
        error: { message: message.message, stack: message.stack },
        ...contextData,
      });
      return;
    }

    // Otherwise use the message and optional trace
    if (trace instanceof Error) {
      this.logger.error(message, {
        error: { message: trace.message, stack: trace.stack },
        ...contextData,
      });
    } else if (typeof trace === "string") {
      this.logger.error(message, {
        error: { stack: trace },
        ...contextData,
      });
    } else {
      this.logger.error(message, contextData);
    }
  }

  /**
   * Print a message with context information
   */
  private printMessage(
    level: string,
    message: any,
    context: string,
    optionalParams: any[] = []
  ): void {
    // Extract metadata from optional params
    let meta: Record<string, any> = {};

    if (optionalParams.length > 0) {
      // If the first optional param is an object, treat it as metadata
      if (
        typeof optionalParams[0] === "object" &&
        !(optionalParams[0] instanceof Error)
      ) {
        meta = optionalParams[0];
      }
    }

    const contextData = this.extractContextData(meta, context);

    // Check if message is an Error
    if (message instanceof Error) {
      this.logger[level](message.message, {
        error: { message: message.message, stack: message.stack },
        ...contextData,
      });
      return;
    }

    this.logger[level](message, contextData);
  }

  /**
   * Extract context data from metadata
   */
  private extractContextData(
    meta?: Record<string, any>,
    context?: string
  ): Record<string, any> {
    const contextData: Record<string, any> = { ...(meta || {}) };

    // Add context if provided or use default
    if (context) {
      contextData.context = context;
    } else if (this.defaultContext && !contextData.context) {
      contextData.context = this.defaultContext;
    }

    return contextData;
  }
}
