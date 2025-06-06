
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import NewReleasesSlider from '@/components/NewReleasesSlider';
import ArticleSection from '@/components/ArticleSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Squares } from '@/components/ui/squares-background';

export default function Index() {
  return (
    <div className="bg-black min-h-screen flex flex-col relative">
      {/* Squares background covering the entire page */}
      <div className="fixed inset-0 z-0">
        <Squares 
          direction="diagonal"
          speed={0.3}
          squareSize={60}
          borderColor="#1a1a1a" 
          hoverFillColor="#2a2a2a"
        />
      </div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <CategorySection />
        <NewReleasesSlider />
        <ArticleSection />
        <Footer />
      </div>
    </div>
  );
}
