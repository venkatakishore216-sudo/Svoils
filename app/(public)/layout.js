"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

function BellIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>;
}

function NotifyBtn() {
  const [status, setStatus] = useState("idle"); // idle | on | off | blocked

  const toggle = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (status === "on") {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await fetch("/api/push/subscribe", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
          await sub.unsubscribe();
        }
      }
      setStatus("idle");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") { setStatus("blocked"); return; }
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    const p = "=".repeat((4 - vapidKey.length % 4) % 4);
    const b = (vapidKey + p).replace(/-/g, "+").replace(/_/g, "/");
    const raw = window.atob(b);
    const key = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) key[i] = raw.charCodeAt(i);
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
    await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) });
    setStatus("on");
  };

  if (status === "blocked") return null;

  return (
    <button className={`${styles.bellBtn} ${status === "on" ? styles.bellOn : ""}`} onClick={toggle} title={status === "on" ? "Turn off notifications" : "Get notified for new videos"}>
      <BellIcon />
      <span>{status === "on" ? "On" : "Notify"}</span>
    </button>
  );
}

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/videos", label: "Videos" },
  ];

  return (
    <>
      {/* Overlay */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span>🌿</span>
          <span><b>SV</b> <span className={styles.oils}>Oils</span></span>
        </Link>

        <div className={styles.right}>
          <NotifyBtn />
          <button className={styles.burger} onClick={() => setOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Desktop links */}
        <ul className={styles.desktopLinks}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? styles.active : ""}>{l.label}</Link>
            </li>
          ))}
          <li>
            <a href="https://wa.me/919573770967?text=I%20want%20to%20order" className={styles.orderBtn} target="_blank" rel="noreferrer">Order Now</a>
          </li>
        </ul>

        {/* Sidebar */}
        <div className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <span className={styles.sidebarBrand}>🌿 SV Oils</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>
          <ul className={styles.sidebarLinks}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={pathname === l.href ? styles.active : ""} onClick={() => setOpen(false)}>{l.label}</Link>
              </li>
            ))}
            <li>
              <a href="https://wa.me/919573770967?text=I%20want%20to%20order" className={styles.orderBtn} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Order Now</a>
            </li>
          </ul>
        </div>
      </nav>

      <div style={{ paddingTop: 68 }}>{children}</div>
    </>
  );
}
