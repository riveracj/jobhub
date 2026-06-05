import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.col}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>J</span>
              <span className={styles.logoText}>JobHub</span>
            </div>
            <p className={styles.desc}>
              JobHub is a local job community platform connecting job seekers with employers in their area. Find work. Hire locally.
            </p>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>For Job Seekers</h4>
            <Link href="/register" className={styles.link}>Browse Jobs</Link>
            <Link href="/register" className={styles.link}>Create Profile</Link>
            <Link href="/dashboard" className={styles.link}>My Applications</Link>
            <Link href="/register" className={styles.link}>Job Alerts</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>For Employers</h4>
            <Link href="/register" className={styles.link}>Post a Job</Link>
            <Link href="/employer" className={styles.link}>Dashboard</Link>
            <Link href="/register" className={styles.link}>Review Applicants</Link>
            <Link href="/register" className={styles.link}>Pricing</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Company</h4>
            <Link href="/" className={styles.link}>About Us</Link>
            <Link href="/" className={styles.link}>Contact</Link>
            <Link href="/" className={styles.link}>Privacy Policy</Link>
            <Link href="/" className={styles.link}>Terms of Service</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <Link href="/" className={styles.link}>Help Center</Link>
            <Link href="/" className={styles.link}>Safety Tips</Link>
            <Link href="/" className={styles.link}>Community Guidelines</Link>
            <Link href="/" className={styles.link}>Report an Issue</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} JobHub. All rights reserved.</p>
          <div className={styles.social}>
            <a href="#" className={styles.socialLink} aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
