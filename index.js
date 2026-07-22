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

server.listen(port, () => {
  console.log(`Chat app đang chạy tại http://localhost:${port}/chat`);
});

io.on('connection', (socket) => {
  console.log('Có một user kết nối!', socket.id);

  socket.on('disconnect', () => {
    console.log('Có một user đã ngắt kết nối!', socket.id);
  });

  // socket.on('CLIENT_SEND_MESSAGE', (data) => {
  //   // io.emit(): trả về data cho các máy a b c
  //   // ví dụ: tính năng nhắn tin
  //   io.emit("SERVER_RETURN_MESSAGE", data)

  //   // socket.emit(): trả data về cho máy a (chính là người gửi data lên)
  //   // 
  //   // socket.emit("SERVER_RETURN_MESSAGE", data)

  //   // socket.emit(): trả data về cho máy b, c (trả data cho những máy khác, ngoài trừ máy của người gửi lên)
  //   // ví dụ: tính năng typing (biết ai đang soạn tin nhắn)
  //   // socket.broadcast.emit("SERVER_RETURN_MESSAGE", data);
  // });

});
