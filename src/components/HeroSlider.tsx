
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingBag, Star, TrendingUp } from "lucide-react";
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
      title: "Discover Your Next Great Read",
      subtitle: "Explore thousands of books from classic literature to modern bestsellers",
      cta: "Browse Collection",
      link: "/books",
      badge: "New Arrivals",
      stats: "10,000+ Books"
    },
    {
      id: 2,
      title: "Premium Quality, Affordable Prices",
      subtitle: "Get the best deals on new and pre-owned books with fast delivery",
      cta: "Shop Now",
      link: "/new-books",
      badge: "Best Deals",
      stats: "Up to 70% Off"
    },
    {
      id: 3,
      title: "Build Your Personal Library",
      subtitle: "Create your wishlist and never miss a book you love",
      cta: "Start Collecting",
      link: "/wishlist",
      badge: "Trending",
      stats: "50+ Categories"
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

  const currentSlideData = slides[currentSlide % slides.length];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-modal">
      {/* Background Image with Professional Overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out ${
          isTransitioning ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
        }`}
        style={{
          backgroundImage: `url(${currentImage.image_url})`
        }}
      />
      
      {/* Professional Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      {/* Content Container */}
      <div className="relative z-10 flex items-center h-full">
        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 md:left-8 z-20 h-12 w-12 bg-background/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/90 transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 md:right-8 z-20 h-12 w-12 bg-background/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/90 transition-all duration-300 hover:scale-110 disabled:opacity-50 shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Main Content */}
        <div className="section-container">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className={`mb-4 transition-all duration-700 delay-100 ${
              isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                <Star className="h-4 w-4" />
                {currentSlideData.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight transition-all duration-700 delay-200 ${
              isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}>
              {currentSlideData.title}
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed transition-all duration-700 delay-300 ${
              isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}>
              {currentSlideData.subtitle}
            </p>

            {/* CTA and Stats */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all duration-700 delay-500 ${
              isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}>
              <Button asChild size="lg" className="btn-primary group">
                <Link to={currentSlideData.link}>
                  <ShoppingBag className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  {currentSlideData.cta}
                </Link>
              </Button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="font-medium">{currentSlideData.stats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border/50 rounded-full px-4 py-3 shadow-lg">
          {Array.from({ length: Math.max(slides.length, deviceImages.length) }).map((_, index) => (
            <button
              key={index}
              onClick={() => !isTransitioning && changeSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 h-3 bg-primary' 
                  : 'w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              } disabled:opacity-50`}
            />
          ))}
        </div>
      </div>

      {/* Elegant Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-border z-20">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-[3000ms] ease-linear"
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
