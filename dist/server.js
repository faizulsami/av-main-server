"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const socket_1 = require("./sockets/socket");
process.on("uncaughtException", (error) => {
    process.exit(1);
});
let server;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            // await mongoose.connect("mongodb+srv://crmAdmin:vqtdVpU9nt9XgmJA@cluster0.a4iwm.mongodb.net/?retryWrites=true&w=majority");
            // logger.info(`🛢   Database is connected successfully`);
            console.log(`🛢   Database is connected successfully`);
            // Create HTTP server from Express app
            server = app_1.default.listen(5000, "0.0.0.0", () => {
                // logger.info(`Application  listening on port ${config.port}`);
                console.log(`Application  listening on port ${index_1.default.port}`);
            });
            // Initialize Socket.IO
            (0, socket_1.initializeSocket)(server);
        }
        catch (err) {
            // errorlogger.error("Failed to connect database", err);
        }
        process.on("unhandledRejection", (error) => {
            if (server) {
                server.close(() => {
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
bootstrap();
process.on("SIGTERM", () => {
    if (server) {
        server.close();
    }
});
