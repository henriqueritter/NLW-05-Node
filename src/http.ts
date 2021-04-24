import express from "express";
import path from "path";
// Config Socket IO
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import "./database";
import { routes } from "./routes";

const app = express();

// Define o front end
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
// engine para usar o HTML (o patrao é JS)
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// ao acessar, renderiza o HTML
app.get("/pages/client", (request, response) => {
  return response.render("html/client.html");
});
app.get("/pages/admin", (request, response) => {
  return response.render("html/admin.html");
});

// server http to Socketio
const http = createServer(app); //Cria protocolo HTTP
const io = new Server(http); //Cria protocolo WebSocket(WS)

//quando o usuario faz o primeiro acesso ao WS
io.on("connection", (socket: Socket) => {
  console.log("Se conectou", socket.id);
});

app.use(express.json());

app.use(routes);

export { http, io };
