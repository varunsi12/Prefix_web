import { LegalPage } from './LegalPage';
import { site } from '../config/site';

/**
 * PLACEHOLDER — requires legal review before launch.
 * Section headings outline what a policy for this product typically covers.
 * Each [TODO] must be replaced with reviewed, accurate text; nothing here is a commitment.
 */
export function Privacy() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <h2>What this policy covers</h2>
      <p>[TODO: Describe the scope — the Pre:Fix iOS app and this website.]</p>

      <h2>Information we collect</h2>
      <ul>
        <li>[TODO: Account information you provide (e.g. name, email, photos, profile details).]</li>
        <li>[TODO: Interests, values and connection preferences you choose to share.]</li>
        <li>[TODO: Location information, if and how it is used for discovery.]</li>
        <li>[TODO: Messages and activity within the app.]</li>
        <li>[TODO: Device and usage data; website analytics.]</li>
      </ul>

      <h2>How we use information</h2>
      <p>[TODO: Purposes — operating the service, surfacing relevant events, places and people, safety, support.]</p>

      <h2>How information is shared</h2>
      <p>[TODO: What other users can see; service providers; legal requirements. State clearly whether data is sold.]</p>

      <h2>Your choices and rights</h2>
      <p>[TODO: Access, correction, deletion, account closure; regional rights (e.g. California).]</p>

      <h2>Data retention and security</h2>
      <p>[TODO: Retention periods and security measures.]</p>

      <h2>Children</h2>
      <p>[TODO: Minimum age requirement.]</p>

      <h2>Changes to this policy</h2>
      <p>[TODO: How updates are communicated.]</p>

      <h2>Contact</h2>
      <p>
        {site.contactEmail ? (
          <>
            Questions about privacy: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </>
        ) : (
          '[TODO: Add a privacy contact — set VITE_CONTACT_EMAIL.]'
        )}
      </p>
    </LegalPage>
  );
}
