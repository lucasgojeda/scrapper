/** Libraries */
import dotenv from "dotenv";
dotenv.config();

/** Server */
import Server from "./server.js";

const server = new Server();

server.listen();
