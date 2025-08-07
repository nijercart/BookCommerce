import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroDesktop from "@/assets/hero-desktop.jpg";
import heroTablet from "@/assets/hero-tablet.jpg";
import heroMobile from "@/assets/hero-mobile.jpg";

interface HeroImage {
  device_type: 'desktop' | 'tablet' | 'mobile';
  image_url: string;
  alt_text: string;
}

const ModernHero = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('device_type, image_url, alt_text')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setHeroImages(data as HeroImage[]);
        } else {
          // Fallback to static images if no data from database
          setHeroImages([
            { device_type: 'desktop', image_url: heroDesktop, alt_text: 'Desktop hero background' },
            { device_type: 'tablet', image_url: heroTablet, alt_text: 'Tablet hero background' },
            { device_type: 'mobile', image_url: heroMobile, alt_text: 'Mobile hero background' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Fallback to static images on error
        setHeroImages([
          { device_type: 'desktop', image_url: heroDesktop, alt_text: 'Desktop hero background' },
          { device_type: 'tablet', image_url: heroTablet, alt_text: 'Tablet hero background' },
          { device_type: 'mobile', image_url: heroMobile, alt_text: 'Mobile hero background' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  const getImageForDevice = (deviceType: 'desktop' | 'tablet' | 'mobile') => {
    const image = heroImages.find(img => img.device_type === deviceType);
    return image || { 
      device_type: deviceType, 
      image_url: deviceType === 'desktop' ? heroDesktop : deviceType === 'tablet' ? heroTablet : heroMobile,
      alt_text: `${deviceType} hero background`
    };
  };

  if (loading) {
    return (
      <section className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </section>
    );
  }

  const desktopImage = getImageForDevice('desktop');
  const tabletImage = getImageForDevice('tablet');
  const mobileImage = getImageForDevice('mobile');

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden">
      {/* Responsive Background Images */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <img
          src={desktopImage.image_url}
          alt={desktopImage.alt_text}
          className="hidden lg:block w-full h-full object-cover object-center"
        />
        {/* Tablet Image */}
        <img
          src={tabletImage.image_url}
          alt={tabletImage.alt_text}
          className="hidden md:block lg:hidden w-full h-full object-cover object-center"
        />
        {/* Mobile Image */}
        <img
          src={mobileImage.image_url}
          alt={mobileImage.alt_text}
          className="block md:hidden w-full h-full object-cover object-center"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl text-left">
            

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
              Discover Your Next
              <span className="block text-primary">Great Read</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 animate-fade-in leading-relaxed max-w-2xl">
              Explore thousands of books from classic literature to modern bestsellers. 
              Find your perfect book and enjoy fast, reliable delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in">
              <Button size="lg" className="group shadow-lg w-full sm:w-auto" asChild>
                <Link to="/books">
                  <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Browse Collection
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="backdrop-blur-sm bg-background/50 border-border/50 w-full sm:w-auto" asChild>
                <Link to="/request">
                  Request a Book
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 animate-fade-in">
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">10k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Books Available</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">5k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">24h</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse"></div>
    </section>
  );
};

export default ModernHero;