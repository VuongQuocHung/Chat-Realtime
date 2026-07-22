require("dotenv").config();

const express = require("express");
const path = require("path");
const clientRoutes = require("./routes/client/index.route");
const { Server } = require("socket.io");
const http = require('http');

const app = express();
const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server);

// Cấu hình pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Thư nục chứa css, js,...
app.use(express.static(path.join(__dirname, "public")));

// Routes phía client
app.use("/", clientRoutes);

// Khai báo một biến toàn cục cho file js backend
global._io = io;

server.listen(port, () => {
  console.log(`Chat app đang chạy tại http://localhost:${port}/chat`);
});

