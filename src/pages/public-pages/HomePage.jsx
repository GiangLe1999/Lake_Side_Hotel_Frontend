import React from "react";
import HeroSection from "../../components/public-pages/home-page/HeroSection";
import FeaturedRooms from "../../components/public-pages/home-page/FeaturedRooms";
import AmenitiesSection from "../../components/public-pages/home-page/AmenitiesSection";
import TestimonialsSection from "../../components/public-pages/home-page/TestimonialsSection";
import NewsletterSection from "../../components/public-pages/home-page/NewsletterSection";
import DiningSection from "../../components/public-pages/home-page/DiningSection";
import LocationSection from "../../components/public-pages/home-page/LocationSection";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedRooms />
      <AmenitiesSection />
      <TestimonialsSection />
      <DiningSection />
      <LocationSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
