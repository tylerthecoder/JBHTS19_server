import { Device, IDeviceModel } from "./models/device";

export async function setDeviceLatLng(
  id: string,
  lat: string,
  lng: string
): Promise<IDeviceModel> {
  const device = await Device.findOneAndUpdate(
    {
      id
    },
    {
      lat,
      lng
    }
  );
  return device as IDeviceModel;
}

export function getAllDevices() {
  return Device.find({});
}

export function deleteAllDevices() {
  return Device.deleteMany({});
}
