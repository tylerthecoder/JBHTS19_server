import { Device } from "./models/device";
import { DeviceUpdate } from "./models/device-log";

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
