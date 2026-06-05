"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className={`${styles.page} ${styles.loggedIn}`}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Welcome back, {user.name.split(" ")[0]}</h1>
          <p className={styles.heroSub}>
            {user.role === "employer"
              ? "Manage your job listings and review applicants."
              : "Find your next opportunity in the community."}
          </p>
          <Link
            href={user.role === "employer" ? "/employer" : "/dashboard"}
            className={styles.primary}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>Local Job Marketplace</span>
          <h1 className={styles.heroTitle}>
            Find work.<br />
            <span className={styles.highlight}>Hire locally.</span>
          </h1>
          <p className={styles.heroSub}>
            JobHub connects job seekers with local employers in your community.
            No corporate runaround — just real people, real jobs, real close.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primary}>Get Started Free</Link>
            <Link href="/login" className={styles.secondary}>Sign In</Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>78+</span>
              <span className={styles.statLabel}>Active Jobs</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>25</span>
              <span className={styles.statLabel}>Employers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>45+</span>
              <span className={styles.statLabel}>Job Seekers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>Local</span>
              <span className={styles.statLabel}>Community</span>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for both sides</h2>
            <p className={styles.sectionSub}>
              Whether you&apos;re looking for work or looking to hire, JobHub makes it simple.
            </p>
          </div>

          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>For Job Seekers</h3>
              <ul className={styles.cardList}>
                <li>Browse local jobs in your area</li>
                <li>Apply with one click</li>
                <li>Track application status in real time</li>
                <li>Connect directly with local employers</li>
                <li>No recruiters, no spam</li>
              </ul>
              <Link href="/register" className={styles.cardCta}>Find Work</Link>
            </div>

            <div className={`${styles.card} ${styles.cardAccent}`}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>For Employers</h3>
              <ul className={styles.cardList}>
                <li>Post jobs and reach local talent</li>
                <li>Review applicants with ease</li>
                <li>Move candidates through pipeline stages</li>
                <li>No job board fees or contracts</li>
                <li>Message seekers directly</li>
              </ul>
              <Link href="/register" className={styles.cardCta}>Start Hiring</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSub}>Get started in minutes, not days.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <h4 className={styles.stepTitle}>Create an account</h4>
              <p className={styles.stepDesc}>Sign up as a job seeker or employer. It&apos;s free.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <h4 className={styles.stepTitle}>Post or browse</h4>
              <p className={styles.stepDesc}>Employers post jobs — seekers find opportunities nearby.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <h4 className={styles.stepTitle}>Apply & review</h4>
              <p className={styles.stepDesc}>Seekers apply with one click. Employers review and respond.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>4</span>
              <h4 className={styles.stepTitle}>Get hired</h4>
              <p className={styles.stepDesc}>Connect, interview, and hire — all within your community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to join your local job community?</h2>
            <p className={styles.ctaSub}>
              Whether you&apos;re hiring or looking for work, JobHub is free to get started.
            </p>
            <Link href="/register" className={styles.primary}>Create Your Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
