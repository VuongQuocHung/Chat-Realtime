require("dotenv").config();

const express = require("express");
const path = require("path");
const clientRoutes = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Thư nục chứa css, js,...
app.use(express.static(path.join(__dirname, "public")));

// Routes phía client
app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Chat app đang chạy tại http://localhost:${port}/chat`);
});
