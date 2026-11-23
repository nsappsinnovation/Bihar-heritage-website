import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  X,
  MapPin,
  Shield,
  Calendar,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Building2,
  Landmark,
  ExternalLink
} from "lucide-react";
import { getData, STORAGE_KEYS } from "../../utils/cmsStorage";
import defaultProtectedSites from "../../data/defaults/defaultProtectedSites.json";

import laalPahariImg from "../../assets/heritage/Laal_Pahari_Lakhisarai.webp";
import mandarImg from "../../assets/heritage/Mandar.webp";
import apasadhGarhImg from "../../assets/heritage/Apasadh Garh.webp";
import apasadh2Img from "../../assets/heritage/Apasadh2.webp";
import apasadh3Img from "../../assets/heritage/Apasadh3.webp";
import bausiBankaImg from "../../assets/heritage/Bausi_Banka.webp";
import bausiBanka2Img from "../../assets/heritage/Bausi_Banka2.webp";
import { safeHref } from "../../utils/safeUrl";

// Fallback state protected sites
const popularStateSites = [
  {
    id: 1,
    name: "Golghar",
    location: "Patna, Bihar",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/gol-ghar-patna-bihar-1-attr-hero?qlt=82&ts=1726740340434",
    protected_since: "08-12-1976",
    subtitle: "A massive beehive‑shaped granary built by Captain John Garstin in 1786 under Warren Hastings to prevent famine. It stands 29 m tall with an inward-leaning dome & spiral staircases offering panoramic views of Patna and the Ganges.",
    distance: 0,
    managed_by: "state"
  },
  {
    id: 2,
    name: "Agam Kuan",
    location: "Patna, Bihar",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/agam-kuan-patna-bihar-1-musthead-hero?qlt=82&ts=1726740207337",
    protected_since: "08-12-1976",
    subtitle: "An ancient circular brick well dating to the Mauryan era (~3rd century BCE). At 44 ft deep and lined with brick and wooden rings, it's tied to Ashoka's pre‑Buddhist history and folklore about torture and an unquenchable depth.",
    distance: 0,
    managed_by: "state"
  },
  {
    id: 10,
    name: "Nepali Mandir",
    location: "Vaishali, Bihar",
    image: "https://res.cloudinary.com/depfrkqat/image/upload/v1753168910/2._Side_view_of_the_nepali_temple_qpr4dq.jpg",
    protected_since: "02-07-1981",
    subtitle: "A Hindu temple built by Nepali artisans with Kathmandu-style pagoda roof and carved wooden struts; serves as a cultural bridge between Bihar and Nepal.",
    distance: 40,
    managed_by: "state"
  },
  {
    id: 13,
    name: "Jalalgarh Fort",
    location: "Purnia, Bihar",
    image: "https://purneatimes.wordpress.com/wp-content/uploads/2019/03/2.jpg",
    protected_since: "16-08-1982",
    subtitle: "A 16th-century defensive fort near Purnia built by Jalal Khan. Comprised of thick walls, bastions, and internal complexes, showcasing medieval military architecture.",
    distance: 330,
    managed_by: "state"
  },
  {
    id: 14,
    name: "Ara House",
    location: "Arrah, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Arrah_House.jpg",
    protected_since: "12-11-1982",
    subtitle: "Ara House, now known as the Veer Kunwar Singh Museum, is a historical building located within the campus of Maharaja College in Arrah, Bihar. It is a national monument that played a significant role during the First War of Indian Independence in 1857, also known as the Siege of Arrah.",
    distance: 50,
    managed_by: "state"
  },
  {
    id: 19,
    name: "Vishnupada Temple",
    location: "Gaya, Bihar",
    image: "https://puja.viaveda.in/wp-content/uploads/2024/11/Vishnupad_Temple_de7a7ce9ce.webp",
    protected_since: "21-02-2007",
    subtitle: "The Vishnupad Temple, located on the banks of the Falgu River in Gaya, Bihar, is a highly revered Hindu temple dedicated to Lord Vishnu. It is one of the most important pilgrimage destinations in the region, particularly for devotees who come to perform rituals for their ancestors.",
    distance: 100,
    managed_by: "state"
  },
  {
    id: 26,
    name: "Munger Fort",
    location: "Munger, Bihar",
    image: "https://res.cloudinary.com/depfrkqat/image/upload/v1753085450/WhatsApp_Image_2025-07-21_at_13.18.34_673ec7e7_uhvk8e.jpg",
    protected_since: "13-01-2001",
    subtitle: "Munger Fort, located in the city of Munger, Bihar, is a formidable historical structure situated on a rocky hillock along the southern bank of the Ganges River. It is a site of immense historical and architectural significance, having played a key role in the region's military and administrative affairs for centuries.",
    distance: 180,
    managed_by: "state"
  },
  {
    id: 27,
    name: "Chirand Mounds",
    location: "Saran, Bihar",
    image: "https://res.cloudinary.com/depfrkqat/image/upload/v1753172343/WhatsApp_Image_2025-07-22_at_13.48.53_27fd8e0c_z7oyir.jpg",
    protected_since: "Ancient",
    subtitle: "Chirand, located in the Saran district of Bihar, is a nationally renowned archaeological site, recognized for its exceptional evidence of the Neolithic age and subsequent cultural periods. Often referred to as the 'rising sun of the neolithic culture in India', Chirand boasts a significant prehistoric mound that holds a continuous archaeological record spanning from the Neolithic period (around 2500–1345 BC) to the reign of the Pal dynasty.",
    distance: 80,
    managed_by: "state"
  },
  {
    id: 34,
    name: "Ahilyasthan",
    location: "Darbhanga, Bihar",
    image: "https://seawatersports.com/images/places/ahilya-sthan.png",
    protected_since: "07-01-2014",
    subtitle: "Ahilya Sthan is a significant Hindu temple located in Darbhanga, Bihar. It is a site steeped in mythology, particularly in connection with the story of Goddess Ahilya from the epic Ramayana. The current structural form of the temple was built between 1662 and 1682 during the reign of Maharaja Chhatra Singh and Maharaja Rudra Singh.",
    distance: 140,
    managed_by: "state"
  },
  {
    id: 35,
    name: "Telhara Monastery Ruins",
    location: "Nalanda, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/IMG_B6465FF4640F-1.jpg/1280px-IMG_B6465FF4640F-1.jpg",
    protected_since: "17-01-2014",
    subtitle: "Telhara, located in the Nalanda district of Bihar, is an important archaeological site known for the ruins of an ancient Buddhist monastery and what is believed to have been a university or seat of learning, possibly older than Nalanda and Vikramshila. It was a prominent center of learning and monastic life, particularly associated with Mahayana Buddhism.",
    distance: 70,
    managed_by: "state"
  }
];

// Fallback ASI central sites
const centralAsiSites = [
  {
    id: "c1",
    name: "Nalanda Ruins (Nalanda Mahavihara)",
    location: "Nalanda, Bihar",
    image: "https://live.staticflickr.com/40/93462777_8a79281973_b.jpg",
    protected_since: "1915",
    subtitle: "The ancient university complex that was the global epicenter of Buddhist learning from the 5th to the 12th century CE. It once housed 10,000 students and 2,000 teachers.",
    distance: 75,
    managed_by: "central"
  },
  {
    id: "c2",
    name: "Vikramshila University Ruins",
    location: "Bhagalpur, Bihar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC4hP0aybObZdkyslIYD5wVN9Y7K-TPA9WPKcsFP7fK12gDvb-CdM9pVY&s=10",
    protected_since: "1960",
    subtitle: "Founded by Pala King Dharmapala in the late 8th century, Vikramshila was one of the two most important centers of learning in India during the Pala Empire, specializing in Vajrayana Buddhism.",
    distance: 255,
    managed_by: "central"
  },
  {
    id: "c3",
    name: "Sher Shah Suri Tomb",
    location: "Sasaram, Rohtas, Bihar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdpkyz8oE4DgWWcRm1t9SafrV6u23dnrL6Q2OhZTsykQ shadow-md",
    protected_since: "1920",
    subtitle: "A masterpiece of Indo-Islamic architecture, this red sandstone octagonal tomb stands in the center of an artificial lake and rises 122 feet high.",
    distance: 158,
    managed_by: "central"
  },
  {
    id: "c4",
    name: "Ashokan Pillar, Kolhua",
    location: "Vaishali, Bihar",
    image: "https://live.staticflickr.com/4546/37614686394_5ea8580bf2_z.jpg",
    protected_since: "1915",
    subtitle: "A monolithic polished sandstone pillar surmounted by a single lion capital facing north, marking the site of Buddha's last sermon.",
    distance: 55,
    managed_by: "central"
  },
  {
    id: "c5",
    name: "Barabar Caves & Nagarjuni Caves",
    location: "Jehanabad, Bihar",
    image: "https://hblimg.mmtcdn.com/content/hubble/img/gaya_imgs/mmt/activities/m_Barabar_caves_3_l_400_600.jpg",
    protected_since: "1922",
    subtitle: "The oldest surviving rock-cut caves in India, carved during the Mauryan Empire (3rd century BCE), featuring highly polished granite walls and Ashokan inscriptions.",
    distance: 65,
    managed_by: "central"
  },
  {
    id: "c6",
    name: "Kesariya Stupa",
    location: "East Champaran, Bihar",
    image: "https://live.staticflickr.com/2821/9239704568_45f99b5731_z.jpg",
    protected_since: "1998",
    subtitle: "The tallest ancient Buddhist stupa in the world, with a circumference of nearly 1,400 feet, rising to a height of 104 feet.",
    distance: 120,
    managed_by: "central"
  },
  {
    id: "c10",
    name: "Cyclopean Wall of Rajgir",
    location: "Rajgir, Nalanda, Bihar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOYFiiQ4rADBUeEs7ZCMnswvZ6UzuGbZ0-kZUkg9Uitw&s=10",
    protected_since: "1910",
    subtitle: "A 40 Km long pre-Mauryan stone wall built of massive raw stones without mortar, representing one of the oldest masonry fortifications in India.",
    distance: 95,
    managed_by: "central"
  }
];

// Fallback UNESCO World Heritage Sites in Bihar
const unescoSites = [
  {
    id: "u1",
    name: "Mahabodhi Temple Complex",
    location: "Bodh Gaya, Gaya, Bihar",
    image: "https://static.toiimg.com/thumb/47081465.cms?resizemode=75&width=1200&height=900",
    protected_since: "2002",
    subtitle: "The sacred temple complex marking the location where Gautama Buddha attained enlightenment under the Bodhi Tree. Inscribed as a UNESCO World Heritage Site in 2002.",
    distance: 110,
    managed_by: "unesco"
  },
  {
    id: "u2",
    name: "Archaeological Ruins of Nalanda Mahavihara",
    location: "Nalanda, Bihar",
    image: "https://live.staticflickr.com/40/93462777_8a79281973_b.jpg",
    protected_since: "2016",
    subtitle: "The ancient ruins of the world's most prestigious monastic-university complex, acting as a global epicentre of Buddhist learning from the 5th to the 12th century CE.",
    distance: 75,
    managed_by: "unesco"
  }
];

// Fallback Other culturally important, non-protected sites
const otherImportantSites = [
  {
    id: "o1",
    name: "Laal Pahari",
    location: "Lakhisarai, Bihar",
    image: laalPahariImg,
    protected_since: "02-07-2018",
    subtitle: "Known locally as 'Lali Pahari,' excavations here revealed an ancient Buddhist hilltop monastery dating to the Pala period (8th–12th century CE). It is the first such hilltop monastery found in the Ganges valley.",
    distance: 135,
    managed_by: "other"
  },
  {
    id: "o2",
    name: "Mandar Hill",
    location: "Bausi, Banka, Bihar",
    image: mandarImg,
    protected_since: "N/A",
    subtitle: "A historic hill associated with the Hindu mythological ocean churning (Samudra Manthan). It contains ancient rock carvings and a Jain temple at the peak.",
    distance: 270,
    managed_by: "other"
  },
  {
    id: "o3",
    name: "Apasadh Garh",
    location: "Nawada, Bihar",
    image: apasadh2Img,
    images: [apasadh2Img, apasadhGarhImg, apasadh3Img],
    protected_since: "16-03-2011",
    subtitle: "A village of immense historical interest known for its ancient ruins, monuments, and stone carvings dating back to King Adityasen of the Later Gupta dynasty (7th century CE).",
    distance: 110,
    managed_by: "other"
  },
  {
    id: "o4",
    name: "Bausi Temples",
    location: "Banka, Bihar",
    image: bausiBankaImg,
    images: [bausiBankaImg, bausiBanka2Img],
    protected_since: "N/A",
    subtitle: "Historical temple complex at the foothills of Mandar Hill, famous for ancient inscriptions, sculptures, and rich cultural heritage.",
    distance: 270,
    managed_by: "other"
  }
];

const OTHER_SITE_ASSET_MAP = {
  o1: {
    image: laalPahariImg,
    images: [laalPahariImg],
  },
  o2: {
    image: mandarImg,
    images: [mandarImg],
  },
  o3: {
    image: apasadh2Img,
    images: [apasadh2Img, apasadhGarhImg, apasadh3Img],
  },
  o4: {
    image: bausiBankaImg,
    images: [bausiBankaImg, bausiBanka2Img],
  },
};

const slideVariants = {
  enter: {
    scale: 0.75,
    opacity: 0,
    y: 0
  },
  center: {
    scale: 1.0,
    opacity: 1,
    y: 0,
    transition: {
      scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.65, ease: "easeOut" }
    }
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    y: 0,
    transition: {
      scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.5, ease: "easeIn" }
    }
  }
};

const ProtectedSitesDetails = () => {
  const [activeTab, setActiveTab] = useState("state"); // 'state', 'central', 'unesco', 'other'
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [modalImgIdx, setModalImgIdx] = useState(0);

  // Dynamic reactive state fetched from admin protected sites CMS
  const [rawSitesData, setRawSitesData] = useState(() =>
    getData(STORAGE_KEYS.PROTECTED_SITES, defaultProtectedSites)
  );

  // Synchronize on CMS updates, storage, focus, visibilitychange
  useEffect(() => {
    const refreshData = () => {
      const fresh = getData(STORAGE_KEYS.PROTECTED_SITES, defaultProtectedSites);
      setRawSitesData(fresh);
    };

    window.addEventListener("storage", refreshData);
    window.addEventListener("bh_cms_update", refreshData);
    window.addEventListener("bh_storage_update", refreshData);
    window.addEventListener("focus", refreshData);
    document.addEventListener("visibilitychange", refreshData);

    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("bh_cms_update", refreshData);
      window.removeEventListener("bh_storage_update", refreshData);
      window.removeEventListener("focus", refreshData);
      document.removeEventListener("visibilitychange", refreshData);
    };
  }, []);

  // Normalize and group dynamic dataset by managed_by classification
  const { stateSites, centralSites, unescoSitesList, otherSites } = useMemo(() => {
    const published = (rawSitesData || [])
      .filter((s) => (s.status || "Published") !== "Draft" && s.status !== "Archived")
      .map((site) => {
        const name = site.name || site.title || "Heritage Monument";
        const location = site.location || (site.district ? `${site.district}, Bihar` : "Bihar");
        const district = site.district || site.location?.split(",").slice(-2, -1)[0]?.trim() || "Patna";
        const locality = site.locality || site.location?.split(",")[0]?.trim() || "";
        const subtitle = site.subtitle || site.description || "An officially protected historical site in Bihar.";
        const managed_by = (site.managed_by || "state").toLowerCase();
        const assetOverride = OTHER_SITE_ASSET_MAP[site.id];
        const image =
          (assetOverride && assetOverride.image) ||
          site.image ||
          (site.images && site.images[0]) ||
          "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
        const images =
          (assetOverride && assetOverride.images) ||
          (Array.isArray(site.images) && site.images.length > 0 ? site.images : [image]);
        const distance = typeof site.distance === "number" ? site.distance : (site.distance ? Number(site.distance) || 0 : 0);
        const map_url = site.map_url || site.mapUrl || site.google_maps_url || "";
        const management_body = site.management_body || (
          managed_by === "unesco"
            ? "UNESCO & Bodhgaya Temple Management Committee / ASI"
            : managed_by === "central"
            ? "Archaeological Survey of India (ASI)"
            : managed_by === "state"
            ? "Directorate of Archaeology, Govt of Bihar"
            : "Local Heritage Trust / Administration"
        );
        const protected_since = site.protected_since || site.notification_date || (managed_by === "central" ? "Centrally Protected (ASI)" : "Officially Protected");

        return {
          ...site,
          name,
          location,
          district,
          locality,
          subtitle,
          managed_by,
          image,
          images,
          distance,
          map_url,
          management_body,
          protected_since
        };
      });

    const state = published.filter((s) => s.managed_by === "state");
    const central = published.filter((s) => s.managed_by === "central");
    const unesco = published.filter((s) => s.managed_by === "unesco");
    const other = published.filter((s) => s.managed_by === "other");

    return {
      stateSites: state.length > 0 ? state : popularStateSites,
      centralSites: central.length > 0 ? central : centralAsiSites,
      unescoSitesList: unesco.length > 0 ? unesco : unescoSites,
      otherSites: other.length > 0 ? other : otherImportantSites
    };
  }, [rawSitesData]);

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef);

  const displayedSites = useMemo(() => {
    if (activeTab === "state") return stateSites;
    if (activeTab === "central") return centralSites;
    if (activeTab === "unesco") return unescoSitesList;
    return otherSites;
  }, [activeTab, stateSites, centralSites, unescoSitesList, otherSites]);

  const activeSite = displayedSites[activeIdx] || displayedSites[0] || {};

  // Scroll animations matching ExcavationCarousel
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  // Scroll-driven scale and vertical translation on the image box
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.93, 1.06]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Auto-advance active monument index at a balanced 5s interval if not paused
  useEffect(() => {
    if (isPaused || !sectionInView || displayedSites.length <= 1) return;

    const duration = displayedSites.length <= 2 ? 6000 : 5000;

    const interval = setInterval(() => {
      setActiveIdx((prevIdx) => (prevIdx + 1) % displayedSites.length);
    }, duration);

    return () => clearInterval(interval);
  }, [isPaused, sectionInView, displayedSites.length]);

  // Reset active index when tab changes
  useEffect(() => {
    setActiveIdx(0);
    setActiveImgIdx(0);
  }, [activeTab]);

  useEffect(() => {
    setActiveImgIdx(0);
  }, [activeIdx]);

  useEffect(() => {
    setModalImgIdx(0);
  }, [selectedSite]);

  // Manual navigation helpers
  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prevIdx) => (prevIdx - 1 + displayedSites.length) % displayedSites.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prevIdx) => (prevIdx + 1) % displayedSites.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Duplicate list to achieve seamless infinite horizontal scrolling marquee loop
  const marqueeSites = [...displayedSites, ...displayedSites];
  // Calculate balanced, smooth marquee duration
  const marqueeDuration = Math.max(42, Math.round(displayedSites.length * 4.5));

  return (
    <section
      ref={sectionRef}
      className="relative py-16 px-6 md:px-12 lg:px-20 border-t border-brand-border/60 bg-brand-dark overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Self-contained Smooth Marquee Keyframe Styling */}
      <style>{`
        @keyframes customMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          display: flex;
          width: max-content;
          animation: customMarquee 45s linear infinite;
        }
        .animate-custom-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative fine-grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `80px 80px`
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header - Left-Aligned Editorial Style with Scroll-triggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-brand-border/60 mb-10 text-left gap-6"
        >
          <div>
            <span className="text-brand-accent text-xs font-bold tracking-[0.25em] uppercase mb-3 inline-block font-sans">
              Preserved Legacies
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-3">
              Protected Monuments
            </h2>
            <p className="text-text-secondary text-sm font-light font-sans max-w-xl">
              Browse through Bihar's historical architectural treasures, officially categorized under State and National preservation divisions.
            </p>
          </div>

          {/* Premium Tab Switcher - Now with four categories */}
          <div className="flex flex-wrap gap-1 bg-white/60 border border-brand-border/60 rounded-3xl md:rounded-full p-1 shadow-sm backdrop-blur-sm self-start md:self-end">
            {[
              { id: "state", label: "State Protected" },
              { id: "central", label: "ASI Managed" },
              { id: "unesco", label: "UNESCO Sites" },
              { id: "other", label: "Other Significant Sites" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wide transition-all cursor-pointer ${activeTab === tab.id ? "text-white" : "text-text-secondary hover:text-brand-accent"
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="protectedTabPillNewest"
                    className="absolute inset-0 bg-brand-accent rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* TOP VIEWPORT: Left side Big Box (Image), Right side Content (Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-12">

          {/* LEFT SIDE: Big Box Image Showcase (Span 7) matching ExcavationCarousel scroll animation */}
          <motion.div
            ref={scrollRef}
            style={{ scale: imageScale, y: imageY }}
            className="lg:col-span-7 aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden border border-brand-border/60 relative bg-brand-dark shadow-md group origin-center"
          >
            {/* Image Container */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={`${activeSite.id}-${activeImgIdx}`}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={
                    (activeSite.images && activeSite.images[activeImgIdx]) ||
                    activeSite.image ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={activeSite.name}
                  className="w-full h-full object-cover filter brightness-[0.95] absolute inset-0"
                />
              </AnimatePresence>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

            {/* Showcase Image Gallery Switcher */}
            {activeSite.images && activeSite.images.length > 1 && (
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                {activeSite.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx(idx);
                    }}
                    className={`w-9 h-7 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${activeImgIdx === idx
                      ? "border-brand-accent scale-105 shadow-md"
                      : "border-white/30 opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img loading="lazy" decoding="async" src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Manual Navigation Overlay Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-text-primary hover:text-brand-accent flex items-center justify-center border border-brand-border/40 hover:scale-105 transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Previous Monument"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-text-primary hover:text-brand-accent flex items-center justify-center border border-brand-border/40 hover:scale-105 transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Next Monument"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>

          {/* RIGHT SIDE: Clean Content Details (Span 5) with Scroll Slide Entrance */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between text-left py-2"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-brand-accent mb-3 font-sans font-bold uppercase tracking-wider">
                <MapPin size={10} />
                <span>{activeSite.location}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4 leading-tight">
                {activeSite.name}
              </h3>

              <p className="text-xs sm:text-sm text-text-secondary font-sans font-light leading-relaxed mb-6 line-clamp-5">
                {activeSite.subtitle}
              </p>

              {/* Registry Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 py-4 border-t border-b border-brand-border/60 mb-6 bg-white/50 px-4.5 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold font-sans mb-1 flex items-center gap-1">
                    <Shield size={11} className="text-brand-accent shrink-0" /> Protection Tier
                  </span>
                  <span className="text-xs text-text-primary font-semibold font-sans truncate">
                    {activeSite.managed_by === "unesco"
                      ? "UNESCO Heritage"
                      : activeSite.managed_by === "central"
                        ? "ASI Centrally Protected"
                        : activeSite.managed_by === "state"
                          ? "State Protected"
                          : "Heritage Site"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold font-sans mb-1 flex items-center gap-1">
                    <Landmark size={11} className="text-brand-accent shrink-0" /> District
                  </span>
                  <span className="text-xs text-text-primary font-semibold font-sans truncate">
                    {activeSite.district || "Patna"}
                  </span>
                </div>

                <div className="flex flex-col col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold font-sans mb-1 flex items-center gap-1">
                    <Calendar size={11} className="text-brand-accent shrink-0" /> Protected Since / Era
                  </span>
                  <span className="text-xs text-text-primary font-semibold font-sans truncate">
                    {activeSite.protected_since || "Ancient Era"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons at the bottom of the right column */}
            <div className="flex flex-wrap items-center gap-4 mt-auto">
              <a
                href="/protected-sites"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>View All Sites</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden border-t border-b border-brand-border/60 bg-white/50 py-4.5"
        >
          {displayedSites.length <= 3 ? (
            /* Centered elegant interactive cards for small sets (e.g. UNESCO World Heritage sites) */
            <div className="flex flex-wrap items-center justify-center gap-4 px-6 max-w-7xl mx-auto">
              {displayedSites.map((site, index) => {
                const isActive = activeIdx === index;
                return (
                  <div
                    key={`${site.id}-${index}`}
                    onClick={() => {
                      setActiveIdx(index);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 6000);
                    }}
                    className={`w-72 sm:w-80 p-3 bg-white border rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-brand-accent bg-brand-accent/5 ring-2 ring-brand-accent/30 shadow-md scale-[1.02]"
                        : "border-brand-border/60 hover:border-brand-accent/40 hover:shadow-xs"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-dark flex-shrink-0">
                      <img decoding="async"
                        src={site.image}
                        alt={site.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-accent font-sans">
                          {site.managed_by === "unesco"
                            ? "UNESCO World Heritage"
                            : site.managed_by === "central"
                            ? "ASI Monument"
                            : "Protected Site"}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-text-primary truncate">
                        {site.name}
                      </h4>
                      <p className="text-[10px] text-text-secondary font-sans truncate">
                        {site.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Smooth, relaxed marquee loop for large monument collections */
            <div
              className="animate-custom-marquee flex items-center gap-4"
              style={{ animationDuration: `${marqueeDuration}s` }}
            >
              {marqueeSites.map((site, index) => {
                const baseIndex = index % displayedSites.length;
                const isActive = activeIdx === baseIndex;
                return (
                  <div
                    key={`${site.id}-${index}`}
                    onClick={() => {
                      setActiveIdx(baseIndex);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 6000);
                    }}
                    className={`flex-shrink-0 w-64 p-3 bg-white border rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/30 shadow-sm"
                        : "border-brand-border/60 hover:border-brand-accent/40"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-dark flex-shrink-0">
                      <img decoding="async"
                        src={site.image}
                        alt={site.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div className="text-left overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-text-primary truncate">
                        {site.name}
                      </h4>
                      <p className="text-[9px] text-text-secondary font-sans truncate">
                        {site.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>

      {/* Lightbox / Modal for selected monument details (matching /protected-sites format) */}
      <AnimatePresence>
        {selectedSite && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedSite(null)}
          >
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative bg-brand-card border border-brand-border/80 max-w-4xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] font-sans rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSite(null)}
                className="absolute top-4 right-4 z-30 bg-brand-dark/80 border border-brand-border/60 hover:border-brand-accent text-text-secondary hover:text-white rounded-full p-2.5 transition-all cursor-pointer shadow-lg"
              >
                <X size={18} />
              </button>

              {/* Modal Image Column with Multi-Image Gallery */}
              <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden flex-shrink-0 bg-brand-dark flex flex-col justify-between">
                <div className="relative flex-1 w-full h-full min-h-[260px]">
                  <img loading="lazy" decoding="async"
                    src={
                      selectedSite.images && selectedSite.images[modalImgIdx]
                        ? selectedSite.images[modalImgIdx]
                        : selectedSite.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop"
                    }
                    alt={selectedSite.name}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Carousel Nav Controls if images exist */}
                  {selectedSite.images && selectedSite.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImgIdx((prev) => (prev === 0 ? selectedSite.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-dark/70 text-white hover:text-brand-accent border border-brand-border/50 transition-all cursor-pointer z-20 hover:scale-110"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImgIdx((prev) => (prev === selectedSite.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-dark/70 text-white hover:text-brand-accent border border-brand-border/50 transition-all cursor-pointer z-20 hover:scale-110"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10 text-left">
                    <span
                       className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md font-sans shadow-md border bg-stone-900/85 text-[#F8F5F0] border-stone-700/40"
                     >
                       {selectedSite.managed_by === "unesco"
                         ? "UNESCO World Heritage"
                         : selectedSite.managed_by === "central"
                           ? "ASI Centrally Protected Monument"
                           : selectedSite.managed_by === "state"
                             ? "State Protected Monument"
                             : "Other Heritage Site"}
                     </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2.5 leading-tight drop-shadow-md">
                      {selectedSite.name}
                    </h4>
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                {selectedSite.images && selectedSite.images.length > 1 && (
                  <div className="p-3 bg-brand-dark/95 border-t border-brand-border/50 flex items-center justify-center gap-2 z-10 shrink-0">
                    {selectedSite.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalImgIdx(idx);
                        }}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          modalImgIdx === idx
                            ? "border-brand-accent scale-105 shadow-md"
                            : "border-brand-border/50 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img loading="lazy" decoding="async"
                          src={img}
                          alt="Gallery thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Details Column */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar max-h-[55vh] md:max-h-none text-left">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-brand-accent text-[11px] font-extrabold uppercase tracking-widest font-sans">
                      Official Monument Profile
                    </span>
                    {selectedSite.sl_no && (
                      <span className="text-text-muted text-xs font-mono">
                        • SL NO: {selectedSite.sl_no}
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                    {selectedSite.subtitle ||
                      "This monument is officially preserved under historical heritage conservation laws in Bihar. It represents a vital architectural and cultural artifact of India's ancient history."}
                  </p>

                  {/* Detailed Specs Grid matching /protected-sites */}
                  <div className="bg-brand-dark/60 p-4 border border-brand-border/60 rounded-2xl mb-6">
                    <h5 className="text-text-primary text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-brand-border/40 font-sans flex items-center gap-1.5">
                      <Info size={14} className="text-brand-accent" /> Heritage Preservation Metadata
                    </h5>

                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Landmark size={11} className="text-brand-accent shrink-0" /> District
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.district || selectedSite.location}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Shield size={11} className="text-brand-accent shrink-0" /> Protected Status / Era
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.protected_since || (selectedSite.managed_by === "central" ? "Centrally Protected (ASI)" : "Officially Protected")}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold font-sans flex items-center gap-1">
                          <Compass size={11} className="text-brand-accent shrink-0" /> Authority Tier
                        </span>
                        <span className="text-xs text-brand-gold font-bold mt-0.5 font-sans">
                          {selectedSite.category ||
                            (selectedSite.managed_by === "unesco"
                              ? "UNESCO World Heritage"
                              : selectedSite.managed_by === "central"
                              ? "ASI Central Protected"
                              : selectedSite.managed_by === "state"
                              ? "State Protected"
                              : "Other Heritage Site")}
                        </span>
                      </div>

                      <div className="col-span-2 flex flex-col pt-2 border-t border-brand-border/40">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider font-sans flex items-center gap-1">
                          <Building2 size={11} className="text-brand-accent shrink-0" /> Management Body
                        </span>
                        <span className="text-xs text-text-primary font-medium mt-0.5 font-sans">
                          {selectedSite.management_body ||
                            (selectedSite.managed_by === "unesco"
                              ? "UNESCO & Govt of Bihar"
                              : selectedSite.managed_by === "central"
                                ? "Archaeological Survey of India (ASI)"
                                : selectedSite.managed_by === "state"
                                  ? "Directorate of Archaeology, Govt of Bihar"
                                  : "Local Heritage Trust / Administration")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                {selectedSite.map_url && (
                  <div className="flex items-center pt-4 border-t border-brand-border/40">
                    <a
                      href={safeHref(selectedSite.map_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-900/30 transition-all font-sans cursor-pointer"
                    >
                      <MapPin size={13} className="text-emerald-300" />
                      <span>Visit on Google Maps</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProtectedSitesDetails;
