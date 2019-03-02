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
  deleteAllDeviceUpdates
} from "./deviceFuncs";
import { mockDeviceUpdates, mockDevices } from "./deviceMocks";

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
app.get("/resetDevices", async function(req, res) {
  console.log("Resetting devices");
  await deleteAllDevices();
  await mockDevices();
  res.send("done");
});

app.get("/resetDeviceUpdate", async function(req, res) {
  console.log("Resetting device updates");
  await deleteAllDeviceUpdates();
  await mockDeviceUpdates();
  res.send("done");
});

app.get("/setDeviceState", async function(req, res) {
  const { deviceId, state } = req.query;
  console.log("set device state", deviceId, state);
  const device = await setDeviceState(deviceId, state == "true" ? true : false);
  const result = {
    deviceName: device.name,
    state: state == "true" ? true : false
  };
  if (pythonSocket) pythonSocket.emit("deviceUpdate", result);
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

app.get("/deviceMetrics", async function(req, res) {
  const { deviceId } = req.query;
  console.log("Device Metrics", deviceId);
  const metrics = await getDeviceMetrics(deviceId);
  res.send(JSON.stringify(metrics));
});

let mainSocket: socketIO.Socket;
let pythonSocket: socketIO.Socket;

io.on("connection", function(socket) {
  console.log("Connection");
  socket.on("setAsMain", function(data) {
    console.log("Set as main");
    mainSocket = socket;
  });

  socket.on("setAsPython", function(data) {
    console.log("Set as python");
    pythonSocket = socket;
  });
});

server.listen(3000, () => {
  console.log("Server listening on port", 3000);
});
