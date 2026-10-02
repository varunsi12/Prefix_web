import { Layout } from '../components/Layout';
import { Seo } from '../lib/seo';
import { site } from '../config/site';
import { Hero } from '../sections/Hero';
import { HowItWorks } from '../sections/HowItWorks';
import { EventsPlaces } from '../sections/EventsPlaces';
import { Positioning } from '../sections/Positioning';
import { Screenshots } from '../sections/Screenshots';
import { About } from '../sections/About';
import { EarlyCommunity } from '../sections/EarlyCommunity';
import { FinalCta } from '../sections/FinalCta';

export function Home() {
  return (
    <Layout>
      <Seo title={`${site.name} — ${site.tagline}`} path="/" />
      <Hero />
      <HowItWorks />
      <EventsPlaces />
      <Positioning />
      <Screenshots />
      <About />
      <EarlyCommunity />
      <FinalCta />
    </Layout>
  );
}
