import { Device } from "./models/device";
import { DeviceUpdate } from "./models/device-log";
import deviceData from "./mocks/device.json";
import deviceUpdateData from "./mocks/deviceUpdates.json";

export async function mockDevices() {
  for (const device of deviceData.devices) {
    const d = await Device.create(device);
    await d.save();
  }
}

export async function mockDeviceUpdates() {
  for (const deviceUpdate of deviceUpdateData.deviceUpdates) {
    const d = await DeviceUpdate.create(deviceUpdate);
    await d.save();
  }
}
