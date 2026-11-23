import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass } from "lucide-react";
import { getData, STORAGE_KEYS } from "../../utils/cmsStorage";
import { defaultHeritageArchives } from "../../data/defaults/cmsDefaults";
import AccordionGallery from "../../components/AccordionGallery/AccordionGallery";

// Local image imports to guarantee successful rendering
import MahabodhiImg from "../../assets/UniqueBiharImg/MahabodhiTemple.webp";
import VikramshilaImg from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import JalMandirImg from "../../assets/GalleryImg/JalMandir.webp";
import PatnaSahibImg from "../../assets/UniqueBiharImg/PatnaSahib.webp";
import AjatshatruImg from "../../assets/GalleryImg/AjatshatruFort.avif";
import NalandaImg from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import RohtasImg from "../../assets/UniqueBiharImg/RohtasFort.webp";
import KesariyaImg from "../../assets/UniqueBiharImg/KesariyaStupa.webp";

const imageMap = {
  "MahabodhiTemple.webp": MahabodhiImg,
  "VIKRAMSHILA_UNIVERSITY.png": VikramshilaImg,
  "JalMandir.jpg": JalMandirImg,
  "PatnaSahib.jpeg": PatnaSahibImg,
  "122da550bb499542e7389b340d6e1923.PNG": AjatshatruImg,
  "2335349331_da09a30ca3_b.jpg": NalandaImg,
  "Rohtas+Fort+Punjab.jpg": RohtasImg,
  "kesariya-stupa-cover-oo_aadi.jpg": KesariyaImg,
};

const resolveArchiveImage = (img) => {
  if (!img) return "";
  if (typeof img !== "string") return img;
  if (imageMap[img]) return imageMap[img];
  const basename = img.split("/").pop();
  if (imageMap[basename]) return imageMap[basename];
  return img;
};

const ExploreHeritageSites = () => {
  const getArchiveData = () => {
    const isSiteActive = (s) => (s.status || "Active") !== "Draft" && (s.status || "Active") !== "Inactive";
    const raw = getData(STORAGE_KEYS?.HERITAGE_ARCHIVES || "bh_heritage_archives", defaultHeritageArchives);
    if (Array.isArray(raw) && raw.length > 0) {
      const active = raw.filter(isSiteActive);
      return active.length > 0 ? active : raw;
    }
    return defaultHeritageArchives;
  };

  const [archivesList, setArchivesList] = useState(getArchiveData);

  useEffect(() => {
    const handleSync = () => {
      setArchivesList(getArchiveData());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("bh_storage_update", handleSync);
    window.addEventListener("bh_cms_update", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("bh_storage_update", handleSync);
      window.removeEventListener("bh_cms_update", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, []);

  // Convert archive data to AccordionGallery items format
  const galleryItems = archivesList.map((site) => ({
    image: resolveArchiveImage(site.image),
    label: site.title,
    link: site.link || "#",
    alt: site.title,
  }));

  // Scroll animations for section entrance
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.2], [0.97, 1]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  return (
    <motion.section
      id="heritage"
      ref={sectionRef}
      style={{ scale: sectionScale, opacity: sectionOpacity, backgroundColor: "#F5EEDEF" }}
      className="relative py-20 px-6 md:px-12 lg:px-20 border-t border-brand-border overflow-hidden scroll-mt-20"
    >
      {/* Decorative Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0), linear-gradient(to right, var(--color-brand-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-border) 1px, transparent 1px)`,
          backgroundSize: `40px 40px, 120px 120px, 120px 120px`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">

        {/* Header Section */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <span className="text-brand-accent text-xs md:text-sm font-sans uppercase tracking-[0.25em] font-bold block mb-3">
              Interactive Explorer
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-text-primary tracking-tight">
              Bihar Heritage Archives
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-sans font-light max-w-2xl mt-4 leading-relaxed">
              Unlock the secrets of ancient monasteries, sacred temples, and majestic hill forts. Hover over the panels to explore Bihar's magnificent heritage.
            </p>
          </div>
        </div>

        {/* Accordion Gallery */}
        {galleryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center w-full bg-white rounded-3xl border border-brand-border/60 shadow-sm px-6">
            <Compass size={40} className="text-brand-accent mb-4 animate-spin-slow" />
            <h3 className="font-serif font-bold text-xl text-text-primary mb-2">No Discoveries Match</h3>
            <p className="text-text-muted text-sm font-sans font-light max-w-md">
              We couldn't find any heritage sites matching your current search parameters. Try using a different category or search term.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <AccordionGallery
              items={galleryItems}
              defaultIndex={0}
              accentColor="#C4973B"
              overlayColor="#1a0f00"
              textColor="#ffffff"
              height={550}
              gap={8}
              radius={20}
              expandRatio={0.52}
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={6}
              stagger={0.06}
              trigger="hover"
              showLabels={true}
              brownTint={true}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ExploreHeritageSites;
