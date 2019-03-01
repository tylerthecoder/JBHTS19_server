import express from "express";
import socketIO from "socket.io";
import http from "http";
import path from "path";

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

app.get("/", function(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
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
