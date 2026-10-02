import { Button, type ButtonProps } from './Button';
import { GET_APP_ANCHOR, site } from '../config/site';
import { track } from '../lib/analytics';

interface GetAppButtonProps {
  /** Where on the page this CTA lives — used for analytics only. */
  location: string;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
  /**
   * What to do when no App Store URL is configured yet.
   *  - 'scroll'   → link to the on-page #get-prefix section (default)
   *  - 'disabled' → render a non-interactive "Coming soon" state
   */
  fallback?: 'scroll' | 'disabled';
  children?: string;
}

/**
 * The one and only "Get Pre:Fix" CTA. Reads the App Store URL from config so
 * pointing every button at the live listing is a single env var change.
 */
export function GetAppButton({
  location,
  size = 'lg',
  variant = 'primary',
  className,
  fallback = 'scroll',
  children = 'Get Pre:Fix',
}: GetAppButtonProps) {
  const hasStoreUrl = Boolean(site.appStoreUrl);
  const onClick = () => track({ name: 'cta_get_app', props: { location, hasStoreUrl } });

  if (site.appStoreUrl) {
    return (
      <Button
        href={site.appStoreUrl}
        target="_blank"
        rel="noopener"
        size={size}
        variant={variant}
        className={className}
        onClick={onClick}
      >
        {children}
        <AppleGlyph />
      </Button>
    );
  }

  if (fallback === 'disabled') {
    return (
      <Button size={size} variant={variant} className={className} aria-disabled="true" onClick={onClick}>
        Coming soon to the App Store
      </Button>
    );
  }

  return (
    <Button href={`#${GET_APP_ANCHOR}`} size={size} variant={variant} className={className} onClick={onClick}>
      {children}
    </Button>
  );
}

function AppleGlyph() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.37 12.6c.03 3.1 2.72 4.13 2.75 4.14-.02.08-.43 1.47-1.42 2.9-.86 1.24-1.75 2.48-3.15 2.5-1.38.03-1.82-.81-3.4-.81-1.57 0-2.06.79-3.36.84-1.35.05-2.38-1.34-3.25-2.57C2.77 17.07 1.4 12.45 3.23 9.4c.9-1.52 2.52-2.48 4.28-2.5 1.33-.03 2.59.9 3.4.9.82 0 2.35-1.11 3.96-.95.67.03 2.56.27 3.77 2.04-.1.06-2.25 1.32-2.27 3.71zM13.8 5.14c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.29.69-3.03 1.56-.66.77-1.25 2-1.1 3.18 1.16.09 2.34-.59 3.06-1.46z" />
    </svg>
  );
}
