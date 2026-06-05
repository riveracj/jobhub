"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "seeker", company: "", phone: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      router.push(user.role === "employer" ? "/employer" : "/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create Account</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input className={styles.input} type="text" placeholder="Full Name" value={form.name} onChange={update("name")} required />
        <input className={styles.input} type="email" placeholder="Email" value={form.email} onChange={update("email")} required />
        <input className={styles.input} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={update("password")} required />
        <input className={styles.input} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={update("phone")} />
        <select className={styles.input} value={form.role} onChange={update("role")}>
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        {form.role === "employer" && (
          <input className={styles.input} type="text" placeholder="Company Name" value={form.company} onChange={update("company")} />
        )}
        <button className={styles.button} type="submit">Create Account</button>
        <p className={styles.footer}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
