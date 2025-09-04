import HomeBanner from '../../../components/ui/home-banner';

export const revalidate = 60; // SSG: regenerates every 60s if needed

export default function Home() {
  return (
    <div className="space-y-12">
      <HomeBanner />
    </div>
  );
}
