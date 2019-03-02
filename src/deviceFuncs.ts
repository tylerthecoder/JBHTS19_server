import { Device, IDeviceModel } from "./models/device";
import { DeviceUpdate } from "./models/device-log";

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
    state,
    time: new Date().getTime()
  });
  await update.save();

  return device;
}

export function getAllDevices() {
  return Device.find({});
}

export async function getDeviceUpdates(deviceId: string) {
  const updates = await DeviceUpdate.find({
    deviceId
  });
  return updates;
}

export async function deleteAllDevices() {
  return await Device.deleteMany({});
}

export async function mockDevices() {
  const d1 = await Device.create({
    name: "light1",
    deviceId: "123",
    isOn: false,
    energyPerHour: 5
  });
  await d1.save();
}

export async function mockDeviceUpdates() {
  const du1 = await DeviceUpdate.create({
    deviceId: "123",
    state: false,
    time: 1551505267741
  });
  await du1.save();

  const du2 = await DeviceUpdate.create({
    deviceId: "123",
    state: false,
    time: 1551505269741
  });
  await du2.save();
}
