
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import NewReleasesSlider from '@/components/NewReleasesSlider';
import ArticleSection from '@/components/ArticleSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Index() {
  const heroRef = useScrollAnimation('scroll-fade-in');
  const categoryRef = useScrollAnimation('scroll-slide-left');
  const newReleasesRef = useScrollAnimation('scroll-fade-in');
  const featuredRef = useScrollAnimation('scroll-slide-right');
  const articleRef = useScrollAnimation('scroll-fade-in');

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <section ref={heroRef as React.RefObject<HTMLDivElement>}>
        <HeroSection />
      </section>
      <section ref={categoryRef as React.RefObject<HTMLDivElement>}>
        <CategorySection />
      </section>
      <section ref={newReleasesRef as React.RefObject<HTMLDivElement>}>
        <NewReleasesSlider />
      </section>
      <section ref={featuredRef as React.RefObject<HTMLDivElement>}>
        <FeaturedProducts />
      </section>
      <section ref={articleRef as React.RefObject<HTMLDivElement>}>
        <ArticleSection />
      </section>
      <Footer />
    </div>
  );
}
