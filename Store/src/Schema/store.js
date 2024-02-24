import { Schema } from "mongoose";

const storeSchema = Schema({
  name: {
    type: String,
    required: [true, "Please enter store name"],
  },
  logo: {
    type: String,
    required: [true, "Please give logo of the store"],
  },
  type: {
    type: String,
    enum: ["Electronics", "Clothing", "Grocery", "Stationery"],
    required: [true, "Please enter store type"],
  },
  location: {
    type: {
      type: String,
      default: "Point",
      required: [true, "Location type is required"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
      required: [true, "Location coordinates are required"],
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required!"],
  },
});
export default storeSchema;
