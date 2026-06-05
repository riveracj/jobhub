import styles from "./Skeleton.module.css";

export function JobCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={`${styles.box} ${styles.avatar}`} />
        <div className={styles.col}>
          <div className={`${styles.line} ${styles.w60}`} />
          <div className={`${styles.line} ${styles.w40}`} />
          <div className={`${styles.line} ${styles.w80}`} />
        </div>
      </div>
    </div>
  );
}

export function JobPanelSkeleton() {
  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <div className={`${styles.box} ${styles.lgAvatar}`} />
        <div className={styles.col}>
          <div className={`${styles.line} ${styles.w70}`} />
          <div className={`${styles.line} ${styles.w45}`} />
          <div className={styles.row}>
            <div className={`${styles.line} ${styles.w20}`} />
            <div className={`${styles.line} ${styles.w20}`} />
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={`${styles.line} ${styles.wFull}`} />
      <div className={`${styles.line} ${styles.wFull}`} />
      <div className={`${styles.line} ${styles.w60}`} />
      <div className={styles.divider} />
      <div className={`${styles.line} ${styles.wFull}`} />
      <div className={`${styles.line} ${styles.wFull}`} />
      <div className={`${styles.line} ${styles.w90}`} />
      <div className={`${styles.line} ${styles.wFull}`} />
      <div className={`${styles.line} ${styles.w50}`} />
    </div>
  );
}

export function SearchBarSkeleton() {
  return (
    <div className={styles.search}>
      <div className={`${styles.line} ${styles.wFull}`} style={{ height: 40 }} />
    </div>
  );
}
