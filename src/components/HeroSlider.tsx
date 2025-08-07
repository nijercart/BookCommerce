
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface HeroImage {
  id: string;
  device_type: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  display_order: number;
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: heroImages = [] } = useQuery({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('device_type, image_url, alt_text, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get the appropriate image for current device
  const getImageForDevice = () => {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 768) {
      deviceType = 'mobile';
    } else if (width < 1024) {
      deviceType = 'tablet';
    }
    
    return heroImages.find(img => img.device_type === deviceType) || heroImages[0];
  };

  const currentImage = getImageForDevice();

  const slides = [
    {
      id: 1,
      title: "Discover Your Next Great Read",
      subtitle: "Explore thousands of books from classic literature to modern bestsellers",
      cta: "Browse Books",
      link: "/books"
    },
    {
      id: 2,
      title: "Premium Quality, Affordable Prices",
      subtitle: "Get the best deals on new and pre-owned books",
      cta: "Shop Now",
      link: "/new-books"
    },
    {
      id: 3,
      title: "Build Your Personal Library",
      subtitle: "Create your wishlist and never miss a book you love",
      cta: "Start Collecting",
      link: "/wishlist"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${currentImage.image_url})`
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-between h-full px-4 md:px-8 lg:px-12">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Content */}
        <div className="flex-1 text-center text-white px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-8 opacity-90 max-w-2xl mx-auto">
            {slides[currentSlide].subtitle}
          </p>
          <Button asChild variant="hero" size="lg" className="text-base md:text-lg px-6 md:px-8">
            <Link to={slides[currentSlide].link}>
              <ShoppingBag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              {slides[currentSlide].cta}
            </Link>
          </Button>
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
