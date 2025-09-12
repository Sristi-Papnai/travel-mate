import Discover from '@/app/(public)/home/_components/discover';
import HomeBanner from './_components/home-banner';
import Benefits from '@/app/(public)/home/_components/benefits';
import JoinCommunity from '@/app/(public)/home/_components/join-community';

export default function Home() {
  return (
    <div className="space-y-12 bg-white">
      <HomeBanner />
      <Discover />
      <Benefits />
      <JoinCommunity />
    </div>
  );
}
