import { Document, Schema, Model, model } from "mongoose";

export interface IDeviceModel extends Document {
  name: string;
  state: string;
  timesChanged: number;
  lastChanged: Date;
}

export var DeviceSchema: Schema = new Schema({
  name: String,
  state: String,
  timesChanged: Number
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
