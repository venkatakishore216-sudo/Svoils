"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.icon}>🌿</div>
        <h2>Admin Login</h2>
        <p className={styles.sub}>Sri Venkateswara Oils</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={login}>
          <div className={styles.field}>
            <label>Username</label>
            <input type="text" placeholder="rajashekar or parameswari" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
