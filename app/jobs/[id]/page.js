"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) return router.push("/dashboard");
      const data = await res.json();
      setJob(data.job);
      setLoading(false);
    }
    load();
  }, [id, router]);

  useEffect(() => {
    if (!user || !job) return;
    fetch("/api/applications")
      .then((r) => r.ok && r.json())
      .then((d) => {
        if (d) {
          const found = d.applications.find((a) => a.jobId === job.id);
          if (found) setApplied(true);
        }
      });
  }, [user, job]);

  async function handleApply() {
    const res = await fetch(`/api/jobs/${id}/apply`, { method: "POST" });
    if (res.ok) setApplied(true);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loadingText}>Loading job...</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to jobs
        </Link>

        <div className={styles.jobHeader}>
          <div className={styles.jobHeaderLeft}>
            <div className={styles.avatar}>
              {(job.employer.company || job.employer.name).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className={styles.title}>{job.title}</h1>
              <p className={styles.company}>{job.employer.company || job.employer.name}</p>
              <div className={styles.tags}>
                <span className={styles.badge}>{job.type}</span>
                {job.tags?.split(",").map((t) => (
                  <span key={t} className={styles.tag}>{t.trim()}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.jobHeaderRight}>
            {applied ? (
              <span className={styles.appliedTag}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Applied
              </span>
            ) : (
              user && <button className={styles.applyBtn} onClick={handleApply}>Apply Now</button>
            )}
          </div>
        </div>

        <div className={styles.detailsGrid}>
          {job.location && (
            <div className={styles.detailCard}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <div>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{job.location}</span>
              </div>
            </div>
          )}
          {job.salary && (
            <div className={styles.detailCard}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              <div>
                <span className={styles.detailLabel}>Salary</span>
                <span className={styles.detailValue}>{job.salary}</span>
              </div>
            </div>
          )}
          <div className={styles.detailCard}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <div>
              <span className={styles.detailLabel}>Employer</span>
              <span className={styles.detailValue}>{job.employer.company || job.employer.name}</span>
            </div>
          </div>
          <div className={styles.detailCard}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <div>
              <span className={styles.detailLabel}>Applicants</span>
              <span className={styles.detailValue}>{job._count?.applications || 0} applicant(s)</span>
            </div>
          </div>
        </div>

        <div className={styles.description}>
          <h2 className={styles.descTitle}>Job Description</h2>
          {job.description.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <br key={i} />;
            if (trimmed.startsWith("About us:") || trimmed.startsWith("Responsibilities:") || trimmed.startsWith("Requirements:")) {
              return <h3 key={i} className={styles.descHeading}>{trimmed}</h3>;
            }
            if (trimmed.startsWith("•")) {
              return <li key={i} className={styles.descBullet}>{trimmed.slice(1).trim()}</li>;
            }
            return <p key={i} className={styles.descText}>{trimmed}</p>;
          })}
        </div>

        {!applied && user && (
          <div className={styles.stickyApply}>
            <button className={styles.applyBtn} onClick={handleApply}>Apply for this job</button>
          </div>
        )}
      </div>
    </div>
  );
}
