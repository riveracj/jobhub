"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import styles from "./page.module.css";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [form, setForm] = useState({ name: "", phone: "", bio: "", skills: "", location: "", resume: "" });
  const [saving, setSaving] = useState(false);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        skills: user.skills || "",
        location: user.location || "",
        resume: user.resume || "",
      });
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.ok && r.json())
      .then((d) => d && setApps(d.applications));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      addToast("Profile updated", "success");
    } else {
      addToast("Failed to save", "error");
    }
    setSaving(false);
  }

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  if (loading) return <div className={styles.loading}><p>Loading...</p></div>;
  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className={styles.headerMeta}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
            <span className={styles.role}>{user.role}</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Info</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input className={styles.input} value={form.name} onChange={handleChange("name")} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} value={form.phone} onChange={handleChange("phone")} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input className={styles.input} value={form.location} onChange={handleChange("location")} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bio</label>
              <textarea className={styles.textarea} rows={4} value={form.bio} onChange={handleChange("bio")} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Skills (comma-separated)</label>
              <input className={styles.input} value={form.skills} onChange={handleChange("skills")} placeholder="e.g. JavaScript, React, Python" />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Resume</h2>
            <div className={styles.field}>
              <label className={styles.label}>Resume URL</label>
              <input className={styles.input} value={form.resume} onChange={handleChange("resume")} placeholder="Link to your resume (Google Drive, Dropbox, etc.)" />
            </div>
            {form.resume && (
              <a href={form.resume} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                View Resume
              </a>
            )}
          </section>

          <button className={styles.saveBtn} type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Applications ({apps.length})</h2>
          {apps.length === 0 && <p className={styles.empty}>No applications yet.</p>}
          <div className={styles.appList}>
            {apps.map((app) => (
              <div key={app.id} className={styles.appCard}>
                <div className={styles.appInfo}>
                  <span className={styles.appJob}>{app.job.title}</span>
                  <span className={styles.appCompany}>{app.job.employer.company || app.job.employer.name}</span>
                </div>
                <span className={`${styles.status} ${styles[app.status]}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
