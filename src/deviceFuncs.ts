import { Device, IDeviceModel } from "./models/device";
import { DeviceUpdate } from "./models/device-log";
import { getRate } from "./server";

export async function setDeviceCords(
  deviceId: string,
  lat: string,
  lng: string
) {
  const device = await Device.findOneAndUpdate(
    { deviceId },
    {
      $set: {
        lat,
        lng
      }
    }
  );
  return device;
}

export async function setDeviceState(deviceId: string, state: boolean) {
  const device = (await Device.findOneAndUpdate(
    { deviceId },
    {
      $set: { isOn: state }
    }
  )) as IDeviceModel;

  const update = await DeviceUpdate.create({
    deviceId: device.deviceId,
    isOn: state,
    time: new Date().getTime()
  });
  await update.save();

  return device;
}

export async function createDevice() {
  const d = await Device.create({
    name: "Lamp",
    deviceId: "6",
    isOn: false,
    watts: 10
  });
  await d.save();
}

export function getAllDevices() {
  return Device.find({});
}

export async function getDeviceByDeviceId(deviceId: string) {
  const device = await Device.findOne({ deviceId });
  return device;
}

export async function getDeviceUpdates(deviceId: string) {
  const updates = await DeviceUpdate.find({
    deviceId
  });
  return updates;
}

export async function getDeviceMetrics(deviceId: string) {
  const updates = await getDeviceUpdates(deviceId);
  const device = (await getDeviceByDeviceId(deviceId)) as IDeviceModel;

  // sort by time
  updates.sort((a, b) => {
    const time1 = new Date(a.time).getTime();
    const time2 = new Date(b.time).getTime();
    return time1 - time2;
  });

  let timeOn = 0;
  let lastState = false;
  let lastTime = 0;
  for (const update of updates) {
    const time = new Date(update.time).getTime();
    if (lastState) {
      timeOn += time - lastTime;
    }
    lastState = update.isOn;
    if (update.isOn) lastTime = time;
  }

  // if device currently on then add its time
  if (device.isOn) {
    timeOn += new Date().getTime() - lastTime;
  }

  const wattSeconds = device.watts * (timeOn / 1000);
  const wattHours = wattSeconds / 60;
  const kwHours = wattHours / 1000;

  const rate = getRate();

  const cost = kwHours * rate;

  return { timeOn, kwHours, cost };
}

export async function getAllMetrics() {
  const devices = await getAllDevices();
  const total = {
    timeOn: 0,
    kwHours: 0,
    cost: 0
  };
  for (const device of devices) {
    const metrics = await getDeviceMetrics(device.deviceId);
    total.timeOn += metrics.timeOn;
    total.kwHours += metrics.kwHours;
    total.cost += metrics.cost;
  }
  return total;
}

export async function deleteAllDevices() {
  return await Device.deleteMany({});
}

export async function deleteAllDeviceUpdates() {
  return await DeviceUpdate.deleteMany({});
}
