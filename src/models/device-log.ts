import { Document, Schema, Model, model } from "mongoose";

export interface IDeviceUpdate extends Document {
  deviceId: string;
  isOn: boolean;
  time: Date;
}

export var DeviceUpdateSchema: Schema = new Schema({
  deviceId: String,
  isOn: Boolean,
  time: Date
});

export const DeviceUpdate: Model<IDeviceUpdate> = model<IDeviceUpdate>(
  "DeviceUpdates",
  DeviceUpdateSchema
);
