import { useParams } from 'react-router';
import { SimplePage } from './SimplePage';
import { Button } from '../components/Button';
import { GetAppButton } from '../components/GetAppButton';
import { InviteCode } from '../components/InviteCode';
import { Seo } from '../lib/seo';
import { buildAppLink, cleanParam, type DeepLinkKind } from '../lib/deeplink';
import { site } from '../config/site';

const COPY: Record<Exclude<DeepLinkKind, 'invite'>, { eyebrow: string; title: string; body: string }> = {
  event: {
    eyebrow: 'Shared from Pre:Fix',
    title: 'This event lives in Pre:Fix.',
    body: 'Open it in the app to see who’s going, pair up, or join a group.',
  },
  venue: {
    eyebrow: 'Shared from Pre:Fix',
    title: 'This place lives in Pre:Fix.',
    body: 'Open it in the app to see who wants to go and make a plan together.',
  },
};

/**
 * Landing stubs for /event/:id and /venue/:id.
 * No data is fetched here — these exist so shared links have a sensible web
 * destination today and can become Universal Links later (see lib/deeplink.ts).
 */
export function EventOrVenue({ kind }: { kind: 'event' | 'venue' }) {
  const { id: raw } = useParams();
  const id = cleanParam(raw);
  const appLink = id ? buildAppLink(kind, id) : undefined;
  const c = COPY[kind];

  return (
    <>
      <Seo title={`${c.title} — ${site.name}`} path={`/${kind}/${id}`} noindex />
      <SimplePage
        eyebrow={c.eyebrow}
        title={c.title}
        actions={
          <>
            {appLink && (
              <Button href={appLink} size="lg">
                Open in Pre:Fix
              </Button>
            )}
            <GetAppButton location={`deeplink-${kind}`} variant={appLink ? 'secondary' : 'primary'} />
          </>
        }
      >
        <p>{c.body}</p>
      </SimplePage>
    </>
  );
}

/** Landing for /invite/:code — prefilled invite entry. */
export function Invite() {
  const { code: raw } = useParams();
  const code = cleanParam(raw, 24);

  return (
    <>
      <Seo title={`You’re invited — ${site.name}`} path={`/invite/${code}`} noindex />
      <SimplePage eyebrow="You’re invited" title="Someone wants you on Pre:Fix.">
        <p>
          Pre:Fix is growing in {site.launchRegion} by invitation.{' '}
          {site.features.inviteCodes ? 'Confirm your code below, then download the app.' : 'Download the app to get started.'}
        </p>
        {site.features.inviteCodes ? (
          <div style={{ display: 'grid', justifyItems: 'center', marginTop: 'var(--space-4)' }}>
            <InviteCode initialCode={code} location="invite-page" />
          </div>
        ) : (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <GetAppButton location="invite-page" />
          </div>
        )}
      </SimplePage>
    </>
  );
}
