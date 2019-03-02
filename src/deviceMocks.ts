import { Device } from "./models/device";
import { DeviceUpdate } from "./models/device-log";

export async function mockDevices() {
  const d1 = await Device.create({
    name: "light",
    deviceId: "0",
    isOn: false,
    watts: 100
  });
  await d1.save();

  const d2 = await Device.create({
    name: "turing",
    deviceId: "1",
    isOn: true,
    watts: 10000
  });
  await d2.save();

  const d3 = await Device.create({
    name: "HVAC",
    deviceId: "2",
    isOn: true,
    watts: 500
  });
  await d3.save();

  const d4 = await Device.create({
    name: "computer lab",
    deviceId: "3",
    isOn: true,
    watts: 1000
  });
  await d4.save();

  const d5 = await Device.create({
    name: "printer",
    deviceId: "4",
    isOn: false,
    watts: 50
  });
  await d5.save();

  const d6 = await Device.create({
    name: "projector",
    deviceId: "5",
    isOn: false,
    watts: 50
  });
  await d6.save();
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
