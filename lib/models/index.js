import mongoose from "mongoose";

// Stock
const StockSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: "kgs" },
  image: { type: String },
});

// Product
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
});

// Video
const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  description: { type: String },
  addedAt: { type: Date, default: Date.now },
});

// Subscription
const SubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: { type: Object, required: true },
  subscribedAt: { type: Date, default: Date.now },
});

export const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
