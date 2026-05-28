"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Home.module.css";

const WA = "https://wa.me/919573770967?text=I%20want%20to%20order%20your%20product";
const SLIDES = [
  { img: "/Gnuts.png", label: "Premium Groundnuts" },
  { img: "/Oil.png", label: "Pure Natural Oils" },
];

export default function HomeClient() {
  const [slide, setSlide] = useState(0);
  const [stock, setStock] = useState({});
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/api/stock").then(r => r.json()).then(setStock).catch(() => {});
    fetch("/api/videos").then(r => r.json()).then(setVideos).catch(() => {});
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className="tag tag-green">Pure · Natural · Trusted</span>
          <h1>Sri Venkateswara<br /><em>Oils & Groundnuts</em></h1>
          <p>Farm-fresh groundnuts and cold-pressed oils — straight from the source. Quality you can taste in every drop.</p>
          <div className={styles.heroBtns}>
            <Link href="/store" className="btn-green">Explore Store</Link>
            <a href={WA} className="btn-wa" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div className={styles.carousel}>
          <div className={styles.carouselFrame}>
            <img key={slide} src={SLIDES[slide].img} alt={SLIDES[slide].label} className={styles.carouselImg} />
            <span className={styles.carouselLabel}>{SLIDES[slide].label}</span>
          </div>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => <button key={i} className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`} onClick={() => setSlide(i)} />)}
          </div>
        </div>
      </section>

      {/* AVAILABILITY */}
      <section className={styles.stockSec}>
        <div className="section-head">
          <span className="tag tag-gold">Live</span>
          <h2 style={{ color: "var(--green)" }}>Product Availability</h2>
          <p>Updated daily by our team</p>
        </div>
        <div className={styles.stockGrid}>
          {Object.entries(stock).map(([key, item]) => (
            <div key={key} className={styles.stockCard}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className={`${styles.avail} ${item.available ? styles.availYes : styles.availNo}`}>
                {item.available ? "✅ Available" : "❌ Not Available"}
              </div>
              {item.available && <a href={WA} className={styles.orderBtn} target="_blank" rel="noreferrer">Order Now</a>}
            </div>
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section className={styles.videosSec}>
          <div className="section-head">
            <h2 style={{ color: "white" }}>Why SV Products?</h2>
            <p style={{ color: "rgba(255,255,255,0.65)" }}>Watch our process and quality</p>
          </div>
          <div className={styles.videosGrid}>
            {videos.slice(0, 3).map(v => (
              <div key={v._id} className={styles.videoCard}>
                <div className={styles.videoWrap}>
                  <iframe src={v.youtubeUrl} title={v.title} frameBorder="0" allowFullScreen />
                </div>
                <div className={styles.videoInfo}>
                  <h4>{v.title}</h4>
                  {v.description && <p>{v.description}</p>}
                </div>
              </div>
            ))}
          </div>
          {videos.length > 3 && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link href="/videos" style={{ color: "white", border: "1.5px solid rgba(255,255,255,0.4)", padding: "10px 28px", borderRadius: 50, fontWeight: 600 }}>View All</Link>
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to Order?</h2>
        <p>Browse products or reach us on WhatsApp</p>
        <div className={styles.ctaBtns}>
          <Link href="/store" className="btn-green">Visit Store</Link>
          <a href={WA} className="btn-wa" target="_blank" rel="noreferrer">WhatsApp Us</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 Sri Venkateswara Oils</p>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>Admin</Link>
      </footer>
    </main>
  );
}
