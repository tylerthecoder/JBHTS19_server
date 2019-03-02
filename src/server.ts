import express from "express";
import socketIO from "socket.io";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import {
  mockDevices,
  deleteAllDevices,
  setDeviceState,
  setDeviceCords,
  mockDeviceUpdates,
  getDeviceUpdates
} from "./deviceFuncs";

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

app.get("/setLatLng", function(req, res) {
  const { lat, lng } = req.query;
  console.log(lat, lng);
  if (mainSocket) {
    mainSocket.emit("lat-lng", { lat, lng });
  }
  res.send(`${lat} ${lng}`);
});

// device routes
app.get("/setMocks", async function(req, res) {
  console.log("Setting mocks");
  await mockDevices();
  res.send("done");
});

app.get("/setMockUpdate", async function(req, res) {
  console.log("Setting mocks updates");
  await mockDeviceUpdates();
  res.send("done");
});

app.get("/deleteDevices", async function(req, res) {
  console.log("Deleting devices");
  await deleteAllDevices();
  res.send("done");
});

app.get("/setDeviceState", async function(req, res) {
  const { id, state } = req.query;
  console.log("set device state", id, state);
  await setDeviceState(id, state == "true" ? true : false);
  res.send("done");
});

app.get("/setDeviceCords", async function(req, res) {
  const { id, lat, lng } = req.query;
  console.log("set device cords", id, lat, lng);
  await setDeviceCords(id, lat, lng);
  res.send("done");
});

app.get("/deviceUpdates", async function(req, res) {
  const { deviceId } = req.query;
  console.log("Device Updates", deviceId);
  const updates = await getDeviceUpdates(deviceId);
  res.send(updates);
});

let mainSocket: socketIO.Socket;

io.on("connection", function(socket) {
  console.log("Connection");
  socket.emit("news", { hello: "world" });
  socket.on("setAsMain", function(data) {
    console.log("Set as main");
    mainSocket = socket;
  });
});

server.listen(3000, () => {
  console.log("Server listening on port", 3000);
});
