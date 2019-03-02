import express from "express";
import socketIO from "socket.io";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import {
  deleteAllDevices,
  setDeviceState,
  setDeviceCords,
  getDeviceUpdates,
  getDeviceMetrics,
  deleteAllDeviceUpdates,
  getAllDevices
} from "./deviceFuncs";
import { mockDeviceUpdates, mockDevices } from "./deviceMocks";

const app = express();
const server = new http.Server(app);
const io = socketIO(server);

mongoose.connect(
  "mongodb+srv://Admin:admin@cluster0-xdf3u.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true },
  () => {
    console.log("Connected to database");
  }
);

app.get("/", function(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.get("/admin", function(req, res) {
  res.sendFile(path.resolve(__dirname, "../public/admin.html"));
});

let theRate: number;

app.get("/setLatLng", function(req, res) {
  const { lat, lng, rate } = req.query;
  theRate = parseFloat(rate);
  console.log("Set cord", lat, lng, rate);
  if (mainSocket) {
    mainSocket.emit("lat-lng", { lat, lng });
  }
  res.send(`${lat} ${lng}`);
});

export function getRate() {
  if (theRate) {
    return theRate;
  } else {
    return 0.1;
  }
}

// device routes
app.get("/device/reset", async function(req, res) {
  console.log("Resetting devices");
  await deleteAllDevices();
  await mockDevices();
  res.send("done");
});

app.get("/device/resetUpdates", async function(req, res) {
  console.log("Resetting device updates");
  await deleteAllDeviceUpdates();
  await mockDeviceUpdates();
  res.send("done");
});

app.get("/device/all", async function(req, res) {
  const data = await getAllDevices();
  res.send(JSON.stringify(data));
});

app.get("/device/setState", async function(req, res) {
  const { deviceId, state } = req.query;
  console.log("set device state", deviceId, state);
  const device = await setDeviceState(deviceId, state == "true" ? true : false);
  const result = {
    deviceId: +device.deviceId,
    state: state == "true" ? true : false
  };
  if (pythonSocket) pythonSocket.emit("deviceUpdate", result);
  if (mainSocket) mainSocket.emit("deviceUpdate", result);
  res.send("done");
});

app.get("/device/setCoords", async function(req, res) {
  const { deviceId, lat, lng } = req.query;
  console.log("set device cords", deviceId, lat, lng);
  await setDeviceCords(deviceId, lat, lng);
  res.send("done");
});

app.get("/device/getUpdates", async function(req, res) {
  const { deviceId } = req.query;
  console.log("Device Updates", deviceId);
  const updates = await getDeviceUpdates(deviceId);
  res.send(updates);
});

app.get("/device/metrics", async function(req, res) {
  const { deviceId } = req.query;
  console.log("Device Metrics", deviceId);
  const metrics = await getDeviceMetrics(deviceId);
  res.send(JSON.stringify(metrics));
});

let mainSocket: socketIO.Socket;
let pythonSocket: socketIO.Socket;

io.on("connection", function(socket) {
  console.log("Connection");
  socket.on("setAsMain", async function(data) {
    console.log("Set as main");
    mainSocket = socket;
    const devices = await getAllDevices();
    socket.emit("allDevices", devices);
  });

  socket.on("setAsPython", function(data) {
    console.log("Set as python");
    pythonSocket = socket;
  });
});

server.listen(3000, () => {
  console.log("Server listening on port", 3000);
});
