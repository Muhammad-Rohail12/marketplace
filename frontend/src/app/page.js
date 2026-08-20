import MainLayout from '@/components/layout/MainLayout';
import HeroSlider from '@/components/home/HeroSlider';
import PopularCategoriesStrip from '@/components/home/PopularCategoriesStrip';
import PromoTilesGrid from '@/components/home/PromoTilesGrid';
import TrustBadgesBar from '@/components/navigation/TrustBadgesBar';
import DealsSection from '@/components/home/DealsSection';
import BrandsSection from '@/components/home/BrandsSection';
import CategoryProductRails from '@/components/home/CategoryProductRails';
import TrendingSection from '@/components/home/TrendingSection';
import RecommendationsSection from '@/components/home/RecommendationsSection';

export default function Home() {
  return (
    <MainLayout>
      <div className="container-page flex flex-col gap-10 py-6">
        <HeroSlider />
        <PopularCategoriesStrip />
        <PromoTilesGrid />
        <DealsSection />
        <BrandsSection />
        <TrendingSection />
        <CategoryProductRails />
        <RecommendationsSection />
      </div>
      <TrustBadgesBar />
    </MainLayout>
  );
}