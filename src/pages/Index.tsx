
import UniversalHeader from "@/components/universal/UniversalHeader";
import FeaturedMovieSlider from "@/components/FeaturedMovieSlider";
import LatestUploadsSection from "@/components/LatestUploadsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <main className="relative">
        {/* Featured Movies Slider */}
        <FeaturedMovieSlider />
        
        {/* Latest Uploads Section */}
        <div className="py-12">
          <LatestUploadsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
