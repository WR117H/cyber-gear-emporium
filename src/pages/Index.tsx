
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import NewReleasesSlider from '@/components/NewReleasesSlider';
import ArticleSection from '@/components/ArticleSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function Index() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <NewReleasesSlider />
      <FeaturedProducts />
      <ArticleSection />
      <Footer />
    </div>
  );
}
