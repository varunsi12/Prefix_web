import type { ReactNode } from 'react';
import { Layout } from '../components/Layout';
import { Seo } from '../lib/seo';
import { site } from '../config/site';
import styles from './LegalPage.module.css';

interface LegalPageProps {
  title: string;
  path: string;
  /** ISO date string shown as "Last updated". */
  updated?: string;
  children: ReactNode;
}

/** Shared shell for Privacy and Terms. Content is placeholder pending legal review. */
export function LegalPage({ title, path, updated, children }: LegalPageProps) {
  return (
    <Layout>
      <Seo title={`${title} — ${site.name}`} path={path} description={`${title} for the Pre:Fix app and website.`} />
      <article className={`container ${styles.article}`}>
        <header className={styles.header}>
          <p className="eyebrow">Legal</p>
          <h1 className={styles.title}>{title}</h1>
          {updated && (
            <p className={styles.updated}>
              Last updated <time dateTime={updated}>{new Date(updated).toLocaleDateString('en-US', { dateStyle: 'long' })}</time>
            </p>
          )}
        </header>

        <div className={styles.notice} role="note">
          <strong>Draft — pending legal review.</strong> This page is a structural placeholder. It does not yet describe
          Pre:Fix’s actual practices and should not be relied upon until replaced with reviewed text.
        </div>

        <div className={styles.prose}>{children}</div>
      </article>
    </Layout>
  );
}
