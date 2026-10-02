import type { ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { OrbitMark } from '../components/orbit/OrbitMark';
import styles from './SimplePage.module.css';

interface SimplePageProps {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}

/** Centered single-message page used by 404 and the deep-link landing stubs. */
export function SimplePage({ eyebrow, title, children, actions }: SimplePageProps) {
  return (
    <Layout>
      <section className={`container ${styles.wrap}`}>
        <OrbitMark orientation="horizontal" size="clamp(110px, 16vw, 150px)" />
        <div className={styles.copy}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {children && <div className={styles.body}>{children}</div>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </section>
    </Layout>
  );
}
