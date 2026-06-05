"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link
          href={user ? (user.role === "employer" ? "/employer" : "/dashboard") : "/"}
          className={styles.logo}
        >
          <span className={styles.logoIcon}>J</span>
          <span className={styles.logoText}>JobHub</span>
        </Link>

        <div className={styles.right}>
          <ThemeToggle />

          {user ? (
            <div className={styles.userArea}>
              <Link
                href={user.role === "employer" ? "/employer" : "/dashboard"}
                className={styles.navLink}
              >
                {user.role === "employer" ? "Dashboard" : "Find Jobs"}
              </Link>
              <Link href="/account" className={styles.navLink}>Profile</Link>
              <button className={styles.logoutBtn} onClick={logout}>Sign Out</button>
            </div>
          ) : (
            <div className={styles.userArea}>
              <Link href="/login" className={styles.navLink}>Sign In</Link>
              <Link href="/register" className={styles.cta}>Get Started</Link>
            </div>
          )}

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.show : ""}`}>
        {user ? (
          <>
            <Link
              href={user.role === "employer" ? "/employer" : "/dashboard"}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {user.role === "employer" ? "Dashboard" : "Find Jobs"}
            </Link>
            <Link href="/account" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</Link>
            <button className={styles.mobileLogout} onClick={() => { logout(); setMenuOpen(false); }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/register" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
