
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import EnhancedSearchResults from "@/components/enhanced/EnhancedSearchResults";

const SearchResults = () => {
  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      <EnhancedSearchResults />
    </UniversalAdsWrapper>
  );
};

export default SearchResults;
