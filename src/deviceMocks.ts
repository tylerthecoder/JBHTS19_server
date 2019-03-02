import { Device } from "./models/device";
import { DeviceUpdate } from "./models/device-log";
import data from "./mocks/device.json";

export async function mockDevices() {
  for (const device of data.devices) {
    const d = await Device.create(device);
    await d.save();
  }
}

export async function mockDeviceUpdates() {
  const du1 = await DeviceUpdate.create({
    deviceId: "1",
    isOn: true,
    time: 1551505267741
  });
  await du1.save();

  const du2 = await DeviceUpdate.create({
    deviceId: "1",
    isOn: false,
    time: 1551505279741
  });
  await du2.save();
}
