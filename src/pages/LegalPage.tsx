import type { ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { Seo } from '../lib/seo';
import { site } from '../config/site';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  title: string;
  path: string;
  description: string;
  /** Effective date as YYYY-MM-DD. */
  effective: string;
  children: ReactNode;
}

/** Formats a YYYY-MM-DD string without timezone drift (no Date parsing of a bare date). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { dateStyle: 'long' });
}

/** Shared shell for Privacy and Terms. */
export function LegalPage({ title, path, description, effective, children }: LegalPageProps) {
  return (
    <Layout>
      <Seo title={`${title} — ${site.name}`} path={path} description={description} />
      <article className={`container ${styles.article}`}>
        <header className={styles.header}>
          <p className="eyebrow">Legal</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>
            Effective <time dateTime={effective}>{formatDate(effective)}</time>
          </p>
        </header>

        <div className={styles.prose}>{children}</div>
      </article>
    </Layout>
  );
}

/**
 * Closing contact paragraph shared by both documents. Mirrors the supplied
 * wording and adds the configured email when one exists.
 */
export function LegalContact({ children }: { children: ReactNode }) {
  return (
    <p>
      {children}
      {site.contactEmail && (
        <>
          {' '}
          You can reach us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </>
      )}
    </p>
  );
}
