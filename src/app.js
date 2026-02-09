const express = require("express");
const { connectdb } = require("../config/dbConfig");
const indexRoute = require("./routes/index");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const perfLogx = require("perf-logx");

const app = express();
app.use(perfLogx());

const port = process.env.PORT2;
const http = require("http");
const { initSocket } = require("./utils/socket");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectdb();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  // standardHeaders: true,
  // legacyHeaders: false,
});
initSocket(io);
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(limiter);
app.use("/api", indexRoute);
server.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
