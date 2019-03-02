import express from "express";
import socketIO from "socket.io";
import http from "http";
import path from "path";
import mongoose from "mongoose";

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

const db = mongoose.connect(
  "mongodb+srv://Admin:admin@cluster0-xdf3u.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true },
  () => {
    console.log("Connected to database");
  }
);

app.get("/", function(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.get("/canvas", function(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/draw.html"));
});

io.on("connection", function(socket) {
  console.log("Connection");
  socket.emit("news", { hello: "world" });
  socket.on("my other event", function(data) {
    console.log(data);
  });
});

server.listen(3000, () => {
  console.log("Server listening on port", 3000);
});
