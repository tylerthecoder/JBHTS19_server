import { Document, Schema, Model, model } from "mongoose";

export interface IDeviceModel extends Document {
  name: string;
  deviceId: string;
  isOn: boolean;
  lat: string;
  lng: string;
  watts: number;
}

export var DeviceSchema: Schema = new Schema({
  name: String,
  deviceId: String,
  isOn: Boolean,
  lat: String,
  lng: String,
  watts: Number,
  lastChanged: Date
});

export const Device: Model<IDeviceModel> = model<IDeviceModel>(
  "Device",
  DeviceSchema
);
