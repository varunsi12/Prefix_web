import { useEffect, useId, useState, type FormEvent } from 'react';
import { Button } from './Button';
import { GetAppButton } from './GetAppButton';
import { site } from '../config/site';
import { track } from '../lib/analytics';
import styles from './InviteCode.module.css';

export const INVITE_STORAGE_KEY = 'prefix.inviteCode';
const CODE_PATTERN = /^[A-Za-z0-9-]{4,24}$/;

interface InviteCodeProps {
  /** Prefill (e.g. from /invite/:code). */
  initialCode?: string;
  /** Analytics location label. */
  location?: string;
}

/**
 * Invite-code entry for the early-access period.
 *
 * There is intentionally no backend: the code is remembered locally and passed
 * along to the App Store CTA so the app can read it after install (once the
 * iOS side supports it). Rendered only while `site.features.inviteCodes` is on —
 * flip VITE_INVITE_ENABLED=false to remove all invite UI.
 */
export function InviteCode({ initialCode = '', location = 'community' }: InviteCodeProps) {
  const id = useId();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Restore a previously entered code (client only).
  useEffect(() => {
    if (initialCode) return;
    try {
      const prev = window.localStorage.getItem(INVITE_STORAGE_KEY);
      if (prev) setSaved(prev);
    } catch {
      /* storage unavailable (private mode) — ignore */
    }
  }, [initialCode]);

  if (!site.features.inviteCodes) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = code.trim();
    if (!CODE_PATTERN.test(value)) {
      setError('Enter the code exactly as it was shared with you (letters, numbers, or dashes).');
      return;
    }
    setError(null);
    try {
      window.localStorage.setItem(INVITE_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    track({ name: 'invite_code_submit', props: { codeLength: value.length } });
    setSaved(value);
  };

  if (saved) {
    return (
      <div className={styles.saved} role="status">
        <p className={styles.savedTitle}>
          You’re in with code <code className={styles.code}>{saved}</code>.
        </p>
        <p className={styles.savedBody}>
          Download Pre:Fix and enter it when you create your account.
        </p>
        <div className={styles.savedActions}>
          <GetAppButton location={`${location}-invite`} size="md" fallback="disabled" />
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setSaved(null);
              setCode('');
              try {
                window.localStorage.removeItem(INVITE_STORAGE_KEY);
              } catch {
                /* ignore */
              }
            }}
          >
            Use a different code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className={styles.label}>
        Have an invite?
      </label>
      <div className={styles.row}>
        <input
          id={id}
          name="invite"
          className={styles.input}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Enter invite code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          onFocus={() => track({ name: 'invite_code_focus' })}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
        />
        <Button type="submit" variant="secondary" size="md">
          Continue
        </Button>
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
