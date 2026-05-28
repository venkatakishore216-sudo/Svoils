"use client";
import { useState, useEffect } from "react";
import styles from "./store.module.css";

const WA = "https://wa.me/919573770967?text=I%20want%20to%20order%20";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => { setProducts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <span className="tag tag-gold">Fresh & Pure</span>
        <h1>Our Products</h1>
        <p>Farm-sourced and naturally processed — no shortcuts, ever</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.grid}>
          {products.map(p => (
            <div key={p._id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img src={p.image} alt={p.name} />
              </div>
              <div className={styles.info}>
                <span className={styles.qty}>{p.quantity}</span>
                <h3>{p.name}</h3>
                {p.description && <p className={styles.desc}>{p.description}</p>}
                <div className={styles.footer}>
                  <span className={styles.price}>₹{p.price}</span>
                  <a
                    href={`${WA}${p.quantity} ${p.name} (₹${p.price})`}
                    className={styles.orderBtn}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.bulkNote}>
        <p>📦 Bulk orders available &nbsp;·&nbsp; 🚚 Local delivery &nbsp;·&nbsp; 📞 WhatsApp to order</p>
        <a
          href="https://wa.me/919573770967?text=I want to place a bulk order"
          className="btn-green"
          target="_blank"
          rel="noreferrer"
        >
          Enquire for Bulk Orders
        </a>
      </div>
    </main>
  );
}
