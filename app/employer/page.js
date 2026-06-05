"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function EmployerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", location: "", tags: "", type: "full-time", salary: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "employer") router.push("/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/jobs?mine=true").then((r) => r.ok && r.json()).then((d) => d && setJobs(d.jobs));
    fetch("/api/applications").then((r) => r.ok && r.json()).then((d) => d && setApplications(d.applications));
  }, [user]);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handlePostJob(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setJobs((prev) => [data.job, ...prev]);
    setShowForm(false);
    setForm({ title: "", description: "", location: "", tags: "", type: "full-time", salary: "" });
  }

  async function handleStatus(appId, status) {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appId, status }),
    });
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    }
  }

  if (loading) return <div className={styles.page}><p>Loading...</p></div>;
  if (!user) return null;

  const jobApps = {};
  for (const app of applications) {
    if (!jobApps[app.jobId]) jobApps[app.jobId] = [];
    jobApps[app.jobId].push(app);
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div>
              <h1 className={styles.heroTitle}>Employer Dashboard</h1>
              <p className={styles.heroSub}>{user.company || user.name}</p>
            </div>
            <button className={styles.postBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "+ Post a Job"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {showForm && (
          <form className={styles.form} onSubmit={handlePostJob}>
            <h2 className={styles.formTitle}>New Job Posting</h2>
            {error && <p className={styles.error}>{error}</p>}
            <input className={styles.input} type="text" placeholder="Job Title *" value={form.title} onChange={update("title")} required />
            <textarea className={styles.textarea} placeholder="Description *" value={form.description} onChange={update("description")} required rows={4} />
            <input className={styles.input} type="text" placeholder="Location" value={form.location} onChange={update("location")} />
            <input className={styles.input} type="text" placeholder="Tags (comma-separated)" value={form.tags} onChange={update("tags")} />
            <div className={styles.row}>
              <select className={styles.input} value={form.type} onChange={update("type")}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
              <input className={styles.input} type="text" placeholder="Salary" value={form.salary} onChange={update("salary")} />
            </div>
            <button className={styles.submitBtn} type="submit">Publish Job</button>
          </form>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Job Listings ({jobs.length})</h2>
          <div className={styles.jobList}>
            {jobs.length === 0 && <p className={styles.empty}>No jobs posted yet</p>}
            {jobs.map((job) => (
              <div key={job.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>{(user.company || user.name).charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.meta}>
                        {job.type} &middot; {job.location || "Remote"} &middot; {job._count.applications} applicant(s)
                      </p>
                    </div>
                  </div>
                  <span className={`${styles.badge} ${job.status === "active" ? styles.active : ""}`}>{job.status}</span>
                </div>

                {job.tags && <p className={styles.tags}>{job.tags}</p>}
                <p className={styles.desc}>{job.description}</p>

                {jobApps[job.id] && jobApps[job.id].length > 0 && (
                  <div className={styles.appsSection}>
                    <p className={styles.appsTitle}>Applications ({jobApps[job.id].length})</p>
                    {jobApps[job.id].map((app) => (
                      <div key={app.id} className={styles.appCard}>
                        <div className={styles.appInfo}>
                          <strong>{app.seeker.name}</strong>
                          {app.seeker.skills && <span className={styles.appTags}>{app.seeker.skills}</span>}
                          {app.coverNote && <p className={styles.note}>{app.coverNote}</p>}
                        </div>
                        <div className={styles.appActions}>
                          <span className={`${styles.status} ${styles[app.status]}`}>{app.status}</span>
                          {app.status === "pending" && (
                            <div className={styles.appActionBtns}>
                              <button className={styles.smallBtn} onClick={() => handleStatus(app.id, "reviewed")}>Review</button>
                              <button className={styles.acceptBtn} onClick={() => handleStatus(app.id, "accepted")}>Accept</button>
                              <button className={styles.rejectBtn} onClick={() => handleStatus(app.id, "rejected")}>Reject</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
