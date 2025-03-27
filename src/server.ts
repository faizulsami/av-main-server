/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import config from "./config/index";
import { initializeSocket } from "./sockets/socket";

process.on("uncaughtException", (error) => {
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    // await mongoose.connect("mongodb+srv://crmAdmin:vqtdVpU9nt9XgmJA@cluster0.a4iwm.mongodb.net/?retryWrites=true&w=majority");
    // logger.info(`🛢   Database is connected successfully`);
    console.log(`🛢   Database is connected successfully`);
    // Create HTTP server from Express app
    server = app.listen(5000, "0.0.0.0", () => {
      // logger.info(`Application  listening on port ${config.port}`);
      console.log(`Application  listening on port ${config.port}`);
    });

    // Initialize Socket.IO
    initializeSocket(server);
  } catch (err) {
    // errorlogger.error("Failed to connect database", err);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on("SIGTERM", () => {
  if (server) {
    server.close();
  }
});
