"use client";
import { useState, useEffect } from "react";
import styles from "./videos.module.css";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then(r => r.json())
      .then(d => { setVideos(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>SV Videos</h1>
        <p>Watch our products, process and quality in action</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className={styles.loading}>No videos yet. Check back soon!</div>
      ) : (
        <div className={styles.grid}>
          {videos.map(v => (
            <div key={v._id} className={styles.card}>
              <div className={styles.wrap}>
                <iframe src={v.youtubeUrl} title={v.title} frameBorder="0" allowFullScreen />
              </div>
              <div className={styles.info}>
                <h3>{v.title}</h3>
                {v.description && <p>{v.description}</p>}
                <span className={styles.date}>
                  {new Date(v.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
