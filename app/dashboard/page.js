"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import Confetti from "@/components/Confetti";
import AnimatedButton from "@/components/AnimatedButton";
import { JobCardSkeleton } from "@/components/Skeleton";
import styles from "./page.module.css";

const PAGE_SIZE = 12;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [allJobs, setAllJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newCardIds, setNewCardIds] = useState([]);

  const sentinelRef = useRef(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    setJobsLoading(true);
    fetch("/api/jobs").then((r) => r.ok && r.json()).then((d) => {
      if (d) setAllJobs(d.jobs);
    }).finally(() => setJobsLoading(false));
    if (user) {
      fetch("/api/applications").then((r) => r.ok && r.json()).then((d) => d && setApps(d.applications));
    }
  }, [user]);

  useEffect(() => {
    if (allJobs.length > 0) {
      setSelectedJob(allJobs[0]);
    }
  }, [allJobs]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 900 && selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedJob]);

  const handleScrollLoad = useCallback(() => {
    if (loadingMore || visibleCount >= allJobs.length) return;
    setLoadingMore(true);
    const prev = visibleCount;
    setTimeout(() => {
      const next = Math.min(visibleCount + PAGE_SIZE, allJobs.length);
      setVisibleCount(next);
      setNewCardIds(allJobs.slice(prev, next).map((j) => j.id));
      setTimeout(() => setNewCardIds([]), 500);
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, visibleCount, allJobs]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleScrollLoad();
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleScrollLoad]);

  useEffect(() => {
    prevCountRef.current = 0;
    setVisibleCount(Math.min(PAGE_SIZE, allJobs.length));
  }, [allJobs]);

  async function handleSearch(e) {
    e.preventDefault();
    const res = await fetch(`/api/jobs?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setAllJobs(data.jobs);
    setSelectedJob(null);
  }

  function handleSelect(job) {
    setSelectedJob(job);
  }

  function handleClose() {
    setSelectedJob(null);
  }

  async function handleApply(jobId) {
    setApplying(true);
    const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setApps((prev) => [data.application, ...prev]);
      setConfetti(true);
      addToast("Application submitted successfully!", "success");
      setTimeout(() => setConfetti(false), 100);
    } else {
      const err = await res.json();
      addToast(err.error || "Failed to apply", "error");
    }
    setApplying(false);
  }

  if (loading) return <div className={styles.loading}><p>Loading...</p></div>;
  if (!user) return null;

  const appliedJobs = new Set(apps.map((a) => a.jobId));
  const visibleJobs = allJobs.slice(0, visibleCount);
  const hasMore = visibleCount < allJobs.length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.searchHeader}>
            <form className={styles.searchBar} onSubmit={handleSearch}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Job title, skill, or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className={styles.searchBtn} type="submit">Search</button>
            </form>
            <p className={styles.resultCount}>{allJobs.length} job{allJobs.length !== 1 ? "s" : ""} found</p>
          </div>

          <div className={styles.jobList}>
            {jobsLoading && (
              <>
                <JobCardSkeleton /><JobCardSkeleton /><JobCardSkeleton />
                <JobCardSkeleton /><JobCardSkeleton /><JobCardSkeleton />
              </>
            )}
            {!jobsLoading && visibleJobs.length === 0 && (
              <div className={styles.emptyWrap}>
                <p className={styles.empty}>No jobs found</p>
              </div>
            )}
            {!jobsLoading && visibleJobs.map((job, idx) => {
              const applied = appliedJobs.has(job.id);
              const isActive = selectedJob?.id === job.id;
              const isNew = newCardIds.includes(job.id);
              return (
                <button
                  key={job.id}
                  className={`${styles.card} ${isActive ? styles.cardActive : ""} ${isNew ? styles.cardNew : ""}`}
                  style={{ animationDelay: `${(idx % PAGE_SIZE) * 0.04}s` }}
                  onClick={() => handleSelect(job)}
                >
                  <div className={styles.cardAvatar}>
                    {(job.employer.company || job.employer.name).charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <span className={styles.badge}>{job.type}</span>
                    </div>
                    <p className={styles.company}>{job.employer.company || job.employer.name}</p>
                    <div className={styles.metaRow}>
                      {job.location && (
                        <span className={styles.meta}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className={styles.meta}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                          {job.salary}
                        </span>
                      )}
                    </div>
                    <p className={styles.cardDesc}>{job.description}</p>
                    {applied && <span className={styles.appliedBadge}>Applied</span>}
                  </div>
                </button>
              );
            })}
            {hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
            {loadingMore && (
              <div className={styles.loadingMore}>
                <span className={styles.loadingSpinner} />
                Loading more jobs...
              </div>
            )}
          </div>

          <div className={styles.appsSection}>
            <h3 className={styles.appsTitle}>My Applications ({apps.length})</h3>
            {apps.length === 0 && <p className={styles.empty}>Not yet</p>}
            {apps.map((app) => (
              <div key={app.id} className={styles.appItem}>
                <div className={styles.appInfo}>
                  <span className={styles.appJob}>{app.job.title}</span>
                  <span className={styles.appCompany}>{app.job.employer.company || app.job.employer.name}</span>
                </div>
                <span className={`${styles.status} ${styles[app.status]}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedJob && (
          <div className={styles.rightPanel} key={selectedJob.id}>
            <div className={styles.panelHeader}>
              <button className={styles.closeBtn} onClick={handleClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className={styles.panelTop}>
              <div className={styles.panelAvatar}>
                {(selectedJob.employer.company || selectedJob.employer.name).charAt(0).toUpperCase()}
              </div>
              <div className={styles.panelMeta}>
                <h2 className={styles.panelTitle}>{selectedJob.title}</h2>
                <p className={styles.panelCompany}>{selectedJob.employer.company || selectedJob.employer.name}</p>
                <div className={styles.panelTags}>
                  <span className={styles.badge}>{selectedJob.type}</span>
                  {selectedJob.tags?.split(",").map((tag) => (
                    <span key={tag} className={styles.tag}>{tag.trim()}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.panelBody}>
              <div className={styles.panelDetails}>
                <div className={styles.detailRow}>
                  {selectedJob.location && (
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <div>
                        <span className={styles.detailLabel}>Location</span>
                        <span className={styles.detailValue}>{selectedJob.location}</span>
                      </div>
                    </div>
                  )}
                  {selectedJob.salary && (
                    <div className={styles.detailItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                      <div>
                        <span className={styles.detailLabel}>Salary</span>
                        <span className={styles.detailValue}>{selectedJob.salary}</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.detailItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <div>
                      <span className={styles.detailLabel}>Applicants</span>
                      <span className={styles.detailValue}>{selectedJob._count.applications} applicant(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.panelDesc}>
                <h3 className={styles.panelSectionTitle}>Job Description</h3>
                {selectedJob.description.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <br key={i} />;
                  if (trimmed.startsWith("About us:") || trimmed.startsWith("Responsibilities:") || trimmed.startsWith("Requirements:")) {
                    return <h4 key={i} className={styles.descHeading}>{trimmed}</h4>;
                  }
                  if (trimmed.startsWith("•")) {
                    return <li key={i} className={styles.descBullet}>{trimmed.slice(1).trim()}</li>;
                  }
                  return <p key={i} className={styles.descText}>{trimmed}</p>;
                })}
              </div>

              <div className={styles.panelActions}>
                <Link href={`/jobs/${selectedJob.id}`} className={styles.viewFullLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /></svg>
                  View full posting
                </Link>
                {appliedJobs.has(selectedJob.id) ? (
                  <span className={styles.alreadyApplied}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Applied
                  </span>
                ) : (
                  <AnimatedButton
                    className={styles.applyBtn}
                    onClick={() => handleApply(selectedJob.id)}
                    disabled={applying}
                  >
                    {applying ? <span className={styles.spinner} /> : "Apply Now"}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedJob && (
          <div className={styles.rightPanel}>
            <div className={styles.panelBody}>
              <div className={styles.emptyPanel}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <p>Select a job to view details</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedJob && <div className={styles.overlay} onClick={handleClose} />}
      <Confetti active={confetti} />
    </div>
  );
}
