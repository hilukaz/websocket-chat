import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));//o express deixa estático o diretório selecionado do projeto

const serverHttp = http.createServer(app); //cria o servidor utilizando o express como rota

const io = new Server(serverHttp); //socket

export { serverHttp, io };
