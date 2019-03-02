import { Device, IDeviceModel } from "./models/device";
import { DeviceUpdate } from "./models/device-log";
import { getRate } from "./server";

export async function setDeviceCords(id: string, lat: string, lng: string) {
  const device = await Device.findByIdAndUpdate(id, {
    $set: {
      lat,
      lng
    }
  });
  return device;
}

export async function setDeviceState(id: string, state: boolean) {
  const device = (await Device.findByIdAndUpdate(id, {
    $set: { isOn: state }
  })) as IDeviceModel;

  const update = await DeviceUpdate.create({
    deviceId: device.deviceId,
    isOn: state,
    time: new Date().getTime()
  });
  await update.save();

  return device;
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
    lastTime = time;
  }

  const wattSeconds = device.watts * (timeOn / 1000);
  const wattHours = wattSeconds / 60;
  const kwHours = wattHours / 1000;

  const rate = getRate();

  const cost = kwHours * rate;

  return { timeOn, kwHours, cost };
}

export async function deleteAllDevices() {
  return await Device.deleteMany({});
}

export async function deleteAllDeviceUpdates() {
  return await DeviceUpdate.deleteMany({});
}

export async function mockDevices() {
  const d1 = await Device.create({
    name: "light1",
    deviceId: "123",
    isOn: false,
    watts: 100
  });
  await d1.save();

  const d2 = await Device.create({
    name: "turing",
    deviceId: "321",
    isOn: true,
    watts: 10000
  });
  await d2.save();
}

export async function mockDeviceUpdates() {
  const du1 = await DeviceUpdate.create({
    deviceId: "123",
    isOn: true,
    time: 1551505267741
  });
  await du1.save();

  const du2 = await DeviceUpdate.create({
    deviceId: "123",
    isOn: true,
    time: 1551505279741
  });
  await du2.save();
}
