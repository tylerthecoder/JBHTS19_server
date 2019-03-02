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
  getAllDevices,
  getAllMetrics,
  createDevice
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

app.get("/setLatLng", async function(req, res) {
  const { lat, lng, rate } = req.query;
  if (rate) theRate = parseFloat(rate);
  console.log("Set cord", lat, lng, rate);
  if (mainSocket) {
    io.to("main").emit("lat-lng", { lat, lng });
    //mainSocket.emit("lat-lng", { lat, lng });
    const devices = await getAllDevices();
    // mainSocket.emit("allDevices", devices);
    io.to("main").emit("allDevices", devices);
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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
  console.log("Getting all devices");
  const data = await getAllDevices();
  res.send(JSON.stringify(data));
});

app.get("/device/new", async function(req, res) {
  console.log("Creating new device");
  await createDevice();
  const devices = await getAllDevices();
  // mainSocket.emit("allDevices", devices);
  io.to("main").emit("allDevices", devices);
  res.send("end");
});

app.get("/device/setState", async function(req, res) {
  const { deviceId, state } = req.query;
  console.log("set device state", deviceId, state);
  const device = await setDeviceState(deviceId, state == "true" ? true : false);
  const result = {
    deviceId: +device.deviceId,
    state: state == "true" ? 1 : 0
  };
  if (pythonSocket) pythonSocket.emit("deviceUpdate", result);
  // if (mainSocket) mainSocket.emit("deviceUpdate", result);
  io.to("main").emit("deviceUpdate", result);
  res.send("done");
});

app.get("/device/setCoords", async function(req, res) {
  const { deviceId, lat, lng } = req.query;
  console.log("set device cords", deviceId, lat, lng);
  await setDeviceCords(deviceId, lat, lng);
  const devices = await getAllDevices();
  mainSocket.emit("allDevices", devices);
  io.to("main").emit("allDevices", devices);
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

app.get("/device/allMetrics", async function(req, res) {
  const metrics = await getAllMetrics();
  res.send(JSON.stringify(metrics));
});

let mainSocket: socketIO.Socket;
let pythonSocket: socketIO.Socket;

io.on("connection", function(socket) {
  console.log("Connection");
  socket.on("setAsMain", async function(data) {
    console.log("Set as main");
    socket.join("main");
    mainSocket = socket;
  });

  socket.on("setCoords", async function(data) {
    console.log(data);
  });

  socket.on("setAsPython", async function(data) {
    console.log("Set as python");
    pythonSocket = socket;
  });
});

server.listen(3000, () => {
  console.log("Server listening on port", 3000);
});
