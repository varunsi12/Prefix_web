import { LegalPage } from './LegalPage';
import { site } from '../config/site';

/**
 * PLACEHOLDER — requires legal review before launch.
 * Section headings outline what terms for this product typically cover.
 * Each [TODO] must be replaced with reviewed, accurate text; nothing here is a commitment.
 */
export function Terms() {
  return (
    <LegalPage title="Terms of Service" path="/terms">
      <h2>Agreement</h2>
      <p>[TODO: Who the agreement is between and what it governs — the Pre:Fix app and website.]</p>

      <h2>Eligibility and accounts</h2>
      <p>[TODO: Minimum age, one account per person, accurate information, account security.]</p>

      <h2>Community standards and safety</h2>
      <ul>
        <li>[TODO: Expected conduct when connecting and meeting in person.]</li>
        <li>[TODO: Prohibited content and behaviour; reporting and blocking.]</li>
        <li>[TODO: Pre:Fix’s role — it facilitates introductions and does not supervise in-person meetings.]</li>
      </ul>

      <h2>Events, venues and third parties</h2>
      <p>[TODO: Event listings, tickets and venues are provided by third parties; Pre:Fix’s responsibility for them.]</p>

      <h2>Your content</h2>
      <p>[TODO: Ownership of what you post and the licence you grant Pre:Fix to operate the service.]</p>

      <h2>Early access and invite codes</h2>
      <p>[TODO: Terms applying to pre-release access, if any.]</p>

      <h2>Termination</h2>
      <p>[TODO: When accounts may be suspended or closed, by you or by Pre:Fix.]</p>

      <h2>Disclaimers and limitation of liability</h2>
      <p>[TODO: To be drafted by counsel.]</p>

      <h2>Governing law and disputes</h2>
      <p>[TODO: Jurisdiction and dispute resolution.]</p>

      <h2>Contact</h2>
      <p>
        {site.contactEmail ? (
          <>
            Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </>
        ) : (
          '[TODO: Add a contact — set VITE_CONTACT_EMAIL.]'
        )}
      </p>
    </LegalPage>
  );
}
