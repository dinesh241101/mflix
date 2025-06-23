
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ScrollableHeader from "@/components/universal/ScrollableHeader";
import EnhancedSearchResults from "@/components/enhanced/EnhancedSearchResults";
import AdBanner from "@/components/ads/AdBanner";
import SmartAdManager from "@/components/ads/SmartAdManager";

const SearchResults = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollableHeader />
      
      <SmartAdManager position="search_page">
        <div className="container mx-auto px-4 py-4">
          {/* Top Ad Banner */}
          <div className="mb-6">
            <AdBanner position="search_top" />
          </div>

          {/* Search Results */}
          <EnhancedSearchResults />

          {/* Bottom Ad Banner */}
          <div className="mt-8">
            <AdBanner position="search_bottom" />
          </div>
        </div>
      </SmartAdManager>
    </div>
  );
};

export default SearchResults;
