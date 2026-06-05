"use client";

import { useEffect, useState } from "react";
import styles from "./Confetti.module.css";

const COLORS = ["#fcd34d", "#4ade80", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316"];
const SHAPES = ["circle", "square", "triangle"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      x: randomBetween(0, 100),
      delay: randomBetween(0, 0.3),
      duration: randomBetween(1.5, 3),
      size: randomBetween(6, 12),
      rotation: randomBetween(0, 360),
    }));

    setParticles(items);

    const timer = setTimeout(() => setParticles([]), 3500);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`${styles.particle} ${styles[p.shape]}`}
          style={{
            left: `${p.x}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
