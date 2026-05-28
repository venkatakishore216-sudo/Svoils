const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI || "mongodb+srv://svproducts01_db_user:wN20CeNr3ZGx5rly@svoils.pmsytl7.mongodb.net/svoils?retryWrites=true&w=majority&appName=svoils";

const StockSchema = new mongoose.Schema({ key: String, name: String, available: Boolean, stock: Number, unit: String, image: String });
const ProductSchema = new mongoose.Schema({ name: String, quantity: String, price: Number, image: String, description: String });
const VideoSchema = new mongoose.Schema({ title: String, youtubeUrl: String, description: String, addedAt: { type: Date, default: Date.now } });

const Stock = mongoose.models.Stock || mongoose.model("Stock", StockSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);

async function seed() {
  await mongoose.connect(URI);
  console.log("✅ Connected!");

  // Clear and reseed stock
  await Stock.deleteMany({});
  await Stock.insertMany([
    { key: "coconutOil", name: "Coconut Oil", available: true, stock: 28, unit: "kgs", image: "/coil.png" },
    { key: "groundnutOil", name: "Groundnut Oil", available: true, stock: 78, unit: "kgs", image: "/goil.png" },
  ]);
  console.log("✅ Stock seeded!");

  // Seed products only if empty
  const pc = await Product.countDocuments();
  if (pc === 0) {
    await Product.insertMany([
      { name: "Special Groundnuts", quantity: "1kg", price: 140, image: "/gnuts.png", description: "Premium quality hand-picked groundnuts" },
      { name: "Normal Groundnuts", quantity: "1kg", price: 120, image: "/gnuts.png", description: "Fresh farm groundnuts at best price" },
      { name: "Groundnut Oil", quantity: "1L", price: 180, image: "/goil.png", description: "Cold-pressed pure groundnut oil" },
      { name: "Coconut Oil", quantity: "1L", price: 300, image: "/coil.png", description: "Pure cold-pressed coconut oil" },
    ]);
    console.log("✅ Products seeded!");
  } else {
    console.log("⚠️ Products exist, skipping");
  }

  console.log("🎉 Done!");
  process.exit(0);
}

seed().catch((e) => { console.error("❌", e.message); process.exit(1); });
