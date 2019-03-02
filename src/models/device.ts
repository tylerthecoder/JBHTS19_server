import { Document, Schema, Model, model } from "mongoose";

export interface IDeviceModel extends Document {
  name: string;
  deviceId: string;
  isOn: boolean;
  lat: string;
  lng: string;
  energyPerHour: number;
  timesChanged: number;
  lastChanged: Date;
}

export var DeviceSchema: Schema = new Schema({
  name: String,
  deviceId: String,
  isOn: Boolean,
  timesChanged: Number,
  lat: String,
  lng: String,
  energyPerHour: Number,
  lastChanged: Date
});

DeviceSchema.pre("save", function(next) {
  const now = new Date();
  (this as IDeviceModel).lastChanged = now;
  next();
});

export const Device: Model<IDeviceModel> = model<IDeviceModel>(
  "Device",
  DeviceSchema
);
