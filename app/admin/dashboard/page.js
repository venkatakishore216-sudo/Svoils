"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("stock");
  const [stock, setStock] = useState({});
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "", price: "", image: "", description: "" });
  const [newVideo, setNewVideo] = useState({ title: "", youtubeUrl: "", description: "" });
  const [msg, setMsg] = useState("");

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const load = useCallback(async () => {
    const [s, p, v] = await Promise.all([
      fetch("/api/stock").then(r => r.json()).catch(() => ({})),
      fetch("/api/products").then(r => r.json()).catch(() => []),
      fetch("/api/videos").then(r => r.json()).catch(() => []),
    ]);
    setStock(s);
    setProducts(Array.isArray(p) ? p : []);
    setVideos(Array.isArray(v) ? v : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  // Stock
  const saveStock = async (key) => {
    const item = stock[key];
    const res = await fetch("/api/stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, stock: Number(item.stock), available: item.available }),
    });
    if (res.ok) { flash("✓ Stock updated!"); load(); }
    else flash("❌ Error saving stock");
  };

  // Products
  const saveProduct = async () => {
    const res = await fetch(`/api/products/${editProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editProduct),
    });
    if (res.ok) { flash("✓ Product updated!"); setEditProduct(null); load(); }
    else flash("❌ Error saving product");
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return flash("❌ Name and price required");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (res.ok) {
      flash("✓ Product added!");
      setNewProduct({ name: "", quantity: "", price: "", image: "", description: "" });
      load();
    } else flash("❌ Error adding product");
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  // Videos
  const addVideo = async () => {
    if (!newVideo.title || !newVideo.youtubeUrl) return flash("❌ Title and URL required");
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVideo),
    });
    if (res.ok) {
      flash("✓ Video added! Subscribers notified 🔔");
      setNewVideo({ title: "", youtubeUrl: "", description: "" });
      load();
    } else flash("❌ Error adding video");
  };

  const deleteVideo = async (id) => {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main className={styles.dashboard}>
      <div className={styles.dashHeader}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Sri Venkateswara Oils</p>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </div>

      {msg && <div className={styles.flashMsg}>{msg}</div>}

      <div className={styles.tabs}>
        {["stock", "products", "videos"].map(t => (
          <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* STOCK */}
      {tab === "stock" && (
        <div className={styles.section}>
          <h3>Product Availability</h3>
          <p className={styles.hint}>Toggle available/not available and update stock numbers</p>
          <div className={styles.stockGrid}>
            {Object.entries(stock).map(([key, item]) => (
              <div key={key} className={styles.stockCard}>
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>

                {/* Available toggle */}
                <div className={styles.toggleRow}>
                  <span>Available</span>
                  <button
                    className={`${styles.toggle} ${item.available ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => setStock({ ...stock, [key]: { ...item, available: !item.available } })}
                  >
                    {item.available ? "YES" : "NO"}
                  </button>
                </div>

                {/* Stock number */}
                <div className={styles.field}>
                  <label>Stock ({item.unit})</label>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={e => setStock({ ...stock, [key]: { ...item, stock: e.target.value } })}
                  />
                </div>

                <button className={styles.saveBtn} onClick={() => saveStock(key)}>Save</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <div className={styles.section}>
          <h3>Products</h3>
          <div className={styles.list}>
            {products.map(p =>
              editProduct?._id === p._id ? (
                <div key={p._id} className={styles.editForm}>
                  {["name", "quantity", "image", "description"].map(f => (
                    <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                      value={editProduct[f] || ""}
                      onChange={e => setEditProduct({ ...editProduct, [f]: e.target.value })} />
                  ))}
                  <input type="number" placeholder="Price (₹)" value={editProduct.price}
                    onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} />
                  <div className={styles.rowBtns}>
                    <button className={styles.saveBtn} onClick={saveProduct}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => setEditProduct(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={p._id} className={styles.listRow}>
                  <div className={styles.listInfo}>
                    <strong>{p.quantity} {p.name}</strong>
                    <span className={styles.listPrice}>₹{p.price}</span>
                  </div>
                  <div className={styles.rowBtns}>
                    <button className={styles.editBtn} onClick={() => setEditProduct(p)}>Edit</button>
                    <button className={styles.delBtn} onClick={() => deleteProduct(p._id)}>Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
          <div className={styles.addForm}>
            <h4>Add New Product</h4>
            {[
              { k: "name", l: "Name" },
              { k: "quantity", l: "Quantity (e.g. 1kg)" },
              { k: "image", l: "Image path (e.g. /gnuts.png)" },
              { k: "description", l: "Description (optional)" },
            ].map(({ k, l }) => (
              <input key={k} placeholder={l} value={newProduct[k]}
                onChange={e => setNewProduct({ ...newProduct, [k]: e.target.value })} />
            ))}
            <input type="number" placeholder="Price (₹)" value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            <button className={styles.saveBtn} onClick={addProduct}>Add Product</button>
          </div>
        </div>
      )}

      {/* VIDEOS */}
      {tab === "videos" && (
        <div className={styles.section}>
          <h3>Videos</h3>
          <p className={styles.hint}>📢 Adding a video auto-notifies all subscribers!</p>
          <div className={styles.list}>
            {videos.map(v => (
              <div key={v._id} className={styles.listRow}>
                <div className={styles.listInfo}>
                  <strong>{v.title}</strong>
                  <span className={styles.vidUrl}>{v.youtubeUrl}</span>
                </div>
                <button className={styles.delBtn} onClick={() => deleteVideo(v._id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className={styles.addForm}>
            <h4>Add New Video</h4>
            <input placeholder="Title" value={newVideo.title}
              onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} />
            <input placeholder="YouTube Embed URL (https://www.youtube.com/embed/VIDEO_ID)"
              value={newVideo.youtubeUrl}
              onChange={e => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })} />
            <input placeholder="Description (optional)" value={newVideo.description}
              onChange={e => setNewVideo({ ...newVideo, description: e.target.value })} />
            <button className={styles.saveBtn} onClick={addVideo}>Add Video & Notify 🔔</button>
          </div>
        </div>
      )}
    </main>
  );
}
