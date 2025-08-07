
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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

  // Get all images for current device
  const getImagesForDevice = () => {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 768) {
      deviceType = 'mobile';
    } else if (width < 1024) {
      deviceType = 'tablet';
    }
    
    return heroImages.filter(img => img.device_type === deviceType);
  };

  const deviceImages = getImagesForDevice();
  const currentImage = deviceImages.length > 0 ? deviceImages[currentSlide % deviceImages.length] : heroImages[0];

  const slides = [
    {
      id: 1,
      // title: "Discover Your Next Great Read",
      // subtitle: "Explore thousands of books from classic literature to modern bestsellers",
      // cta: "Browse Books",
      link: "/books"
    },
    {
      id: 2,
      // title: "Premium Quality, Affordable Prices",
      // subtitle: "Get the best deals on new and pre-owned books",
      // cta: "Shop Now",
      // link: "/new-books"
    },
    {
      id: 3,
      // title: "Build Your Personal Library",
      // subtitle: "Create your wishlist and never miss a book you love",
      // cta: "Start Collecting",
      // link: "/wishlist"
    }
  ];

  const changeSlide = (newSlide: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        const totalSlides = Math.max(slides.length, deviceImages.length);
        const nextSlide = (currentSlide + 1) % totalSlides;
        changeSlide(nextSlide);
      }
    }, 3000); // Changed to 3 seconds

    return () => clearInterval(timer);
  }, [currentSlide, slides.length, deviceImages.length, isTransitioning]);

  const nextSlide = () => {
    if (!isTransitioning) {
      const totalSlides = Math.max(slides.length, deviceImages.length);
      const next = (currentSlide + 1) % totalSlides;
      changeSlide(next);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      const totalSlides = Math.max(slides.length, deviceImages.length);
      const prev = (currentSlide - 1 + totalSlides) % totalSlides;
      changeSlide(prev);
    }
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl">
      {/* Background Image with smooth transition */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out ${
          isTransitioning ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
        }`}
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
          disabled={isTransitioning}
          className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Content */}
        <div className="flex-1 text-center text-white px-4">
          <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {slides[currentSlide % slides.length]?.title || "Discover Great Books"}
          </h1>
          <p className={`text-sm md:text-lg lg:text-xl mb-4 md:mb-8 opacity-90 max-w-2xl mx-auto transition-all duration-500 delay-100 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {slides[currentSlide % slides.length]?.subtitle || "Find your next favorite read"}
          </p>
          <div className={`transition-all duration-500 delay-200 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <Button asChild variant="hero" size="lg" className="text-base md:text-lg px-6 md:px-8 hover:scale-105 transition-transform duration-200">
              <Link to={slides[currentSlide % slides.length]?.link || "/books"}>
                <ShoppingBag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                {slides[currentSlide % slides.length]?.cta || "Browse Books"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          disabled={isTransitioning}
          className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {Array.from({ length: Math.max(slides.length, deviceImages.length) }).map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && changeSlide(index)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-105'
            } disabled:opacity-50`}
          />
        ))}
      </div>

      {/* Progress bar for current slide */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div 
          className="h-full bg-white transition-all duration-[3000ms] ease-linear"
          style={{ 
            width: isTransitioning ? '0%' : '100%',
            transitionDuration: isTransitioning ? '0ms' : '3000ms'
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
