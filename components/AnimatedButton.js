"use client";

import { useState } from "react";
import styles from "./AnimatedButton.module.css";

export default function AnimatedButton({ onClick, children, variant = "primary", disabled, className }) {
  const [ripples, setRipples] = useState([]);

  function handleClick(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    if (onClick) onClick(e);
  }

  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className || ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
        />
      ))}
      {children}
    </button>
  );
}
