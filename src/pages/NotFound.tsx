import { SimplePage } from './SimplePage';
import { Button } from '../components/Button';
import { GetAppButton } from '../components/GetAppButton';
import { Seo } from '../lib/seo';
import { site } from '../config/site';

export function NotFound() {
  return (
    <>
      <Seo title={`Page not found — ${site.name}`} path="/404" noindex />
      <SimplePage
        eyebrow="404"
        title="This one’s not on the map."
        actions={
          <>
            <Button href="/" variant="secondary" size="lg">
              Back to Pre:Fix
            </Button>
            <GetAppButton location="404" />
          </>
        }
      >
        <p>The page you’re looking for doesn’t exist or has moved.</p>
      </SimplePage>
    </>
  );
}
