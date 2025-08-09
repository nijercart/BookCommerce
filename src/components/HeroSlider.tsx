
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
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Professional Container with Subtle Border */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/10 shadow-2xl">
        {/* Background Image with Enhanced Transitions */}
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out ${
            isTransitioning ? 'scale-105 opacity-85 blur-[2px]' : 'scale-100 opacity-100 blur-0'
          }`}
          style={{
            backgroundImage: `url(${currentImage.image_url})`
          }}
        />
        
        {/* Sophisticated Multi-Layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Professional Navigation */}
        <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={isTransitioning}
            className="h-14 w-14 bg-background/90 backdrop-blur-xl border-2 border-border/20 text-foreground hover:bg-background hover:border-primary/30 transition-all duration-300 hover:scale-105 disabled:opacity-40 shadow-xl rounded-2xl group"
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={isTransitioning}
            className="h-14 w-14 bg-background/90 backdrop-blur-xl border-2 border-border/20 text-foreground hover:bg-background hover:border-primary/30 transition-all duration-300 hover:scale-105 disabled:opacity-40 shadow-xl rounded-2xl group"
          >
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Premium Content Layout */}
        <div className="relative z-10 flex items-center h-full">
          <div className="section-container">
            <div className="max-w-4xl">
              {/* Premium Badge with Enhanced Styling */}
              <div className={`mb-6 transition-all duration-800 delay-200 ${
                isTransitioning ? 'opacity-0 translate-y-12 scale-95' : 'opacity-100 translate-y-0 scale-100'
              }`}>
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/15 to-secondary/15 backdrop-blur-xl border border-primary/20 px-6 py-3 rounded-2xl shadow-lg group hover:shadow-xl transition-all duration-300">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-primary font-semibold text-sm tracking-wide uppercase">
                    {currentSlideData.badge}
                  </span>
                </div>
              </div>

              {/* Enhanced Typography */}
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight transition-all duration-800 delay-400 ${
                isTransitioning ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
              }`}>
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  {currentSlideData.title}
                </span>
              </h1>

              {/* Professional Subtitle */}
              <p className={`text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl leading-relaxed font-medium transition-all duration-800 delay-600 ${
                isTransitioning ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
              }`}>
                {currentSlideData.subtitle}
              </p>

              {/* Premium CTA Section */}
              <div className={`flex flex-col lg:flex-row items-start lg:items-center gap-8 transition-all duration-800 delay-800 ${
                isTransitioning ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
              }`}>
                <Button asChild size="lg" className="btn-primary group px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to={currentSlideData.link}>
                    <ShoppingBag className="mr-4 h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    {currentSlideData.cta}
                  </Link>
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-background/60 backdrop-blur-md border border-border/30 rounded-2xl px-6 py-3 shadow-md">
                    <div className="h-3 w-3 bg-accent rounded-full animate-pulse" />
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span className="text-foreground font-semibold text-lg">{currentSlideData.stats}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-4 bg-background/95 backdrop-blur-xl border-2 border-border/20 rounded-3xl px-8 py-4 shadow-2xl">
            {Array.from({ length: Math.max(slides.length, deviceImages.length) }).map((_, index) => (
              <button
                key={index}
                onClick={() => !isTransitioning && changeSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-500 rounded-2xl ${
                  index === currentSlide 
                    ? 'w-12 h-4 bg-gradient-to-r from-primary to-secondary shadow-lg' 
                    : 'w-4 h-4 bg-muted-foreground/20 hover:bg-muted-foreground/40 hover:scale-110'
                } disabled:opacity-50`}
              />
            ))}
          </div>
        </div>

        {/* Premium Progress Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-border/20 via-border/10 to-border/20 z-20">
          <div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary shadow-sm transition-all duration-[3000ms] ease-in-out"
            style={{ 
              width: isTransitioning ? '0%' : '100%',
              transitionDuration: isTransitioning ? '0ms' : '3000ms'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
