import React, { useState, useEffect } from 'react';

// Data & Utilities
import heritageData from '../../data/biharHeritage.json';
import { heritageImageMap } from './heritageImages';
import { defaultTangibleHeritage } from '../../data/defaults/defaultTangibleHeritage';

// Section components
import HeritageParchmentHero from './HeritageParchmentHero';
import HeritageIntroEditorial from './HeritageIntroEditorial';
import HeritageFiltersGrid from './HeritageFiltersGrid';
import HeritageDetailModal from './HeritageDetailModal';
import HearTheHeritage from './HearTheHeritage';
import WatchTheTradition from './WatchTheTradition';

const IntangibleHeritagePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState(null);
  const [selectedHeritage, setSelectedHeritage] = useState(null);

  const rawHeritages = defaultTangibleHeritage;

  // Resolve image keys and custom uploaded image URLs for display (prioritize local bundled assets)
  const resolvedHeritages = rawHeritages
    .filter((h) => (h.status || "Published") !== "Inactive" && (h.status || "Published") !== "Draft")
    .map((h) => {
      const localImage = (h.imageKey && heritageImageMap[h.imageKey]) || (h.id && heritageImageMap[h.id]) || null;
      const imgCandidate = typeof h.image === 'string' && h.image.startsWith('data:') ? h.image : (localImage || h.image || h.imageUrl || null);
      return {
        ...h,
        resolvedImage: imgCandidate,
      };
    });

  // SEO — update document title on mount
  useEffect(() => {
    const prev = document.title;
    document.title =
      'Intangible & Living Cultural Heritage of Bihar | Bihar Heritage Development Society';
    return () => { document.title = prev; };
  }, []);

  const handleRegionReset = () => setActiveRegion(null);

  return (
    <div className="lh-page" style={{ background: '#F7EEDC' }}>

      {/* 1. Hero */}
      <HeritageParchmentHero />

      {/* 2. Editorial Introduction */}
      <HeritageIntroEditorial />

      {/* 3. Heritage Explorer (Filters + Grid) */}
      <HeritageFiltersGrid
        categories={heritageData.categories}
        heritages={resolvedHeritages}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onCardClick={setSelectedHeritage}
        activeRegion={activeRegion}
        onRegionReset={handleRegionReset}
      />

      {/* 4. Hear the Heritage */}
      <HearTheHeritage audioTraditions={heritageData.audioTraditions} />

      {/* 5. Watch the Tradition */}
      <WatchTheTradition
        videoTraditions={heritageData.videoTraditions}
        imageMap={heritageImageMap}
      />

      {/* Heritage Detail Modal */}
      {selectedHeritage && (
        <HeritageDetailModal
          heritage={selectedHeritage}
          onClose={() => setSelectedHeritage(null)}
        />
      )}
    </div>
  );
};

export default IntangibleHeritagePage;
