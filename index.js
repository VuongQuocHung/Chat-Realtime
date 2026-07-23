require("dotenv").config();

const express = require("express");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const clientRoutes = require("./routes/client/index.route");
const authMiddleware = require("./middlewares/client/auth.middleware");
const { connectDB } = require("./configs/database.config");

connectDB();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

global._io = io; // tạo biến global để dùng trong các file backend

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware.attachUser);
app.use("/", clientRoutes);

const readCookie = (cookieHeader, name) => {
  const cookie = cookieHeader
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
};

io.use(async (socket, next) => {
  try {
    const token = readCookie(socket.handshake.headers.cookie, "token");
    const user = await authMiddleware.getUserFromToken(token);

    if (!user) {
      return next(new Error("Bạn cần đăng nhập để kết nối chat."));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Phiên đăng nhập không hợp lệ."));
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.user.fullName} đã kết nối chat: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`${socket.user.fullName} đã ngắt kết nối chat: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Chat app đang chạy tại http://localhost:${port}`);
});
