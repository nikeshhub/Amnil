import { Schema } from "mongoose";


const productSchema = Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  price: {
    type: Number,
    required: [true, "Please enter price of the product"],
  },
  quantity: {
    type: Number,
    required: [true, "Please enter product quantity"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  productImage: {
    type: String,
    required: [true, "Please enter product image"],
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
  },
});
export default productSchema;
