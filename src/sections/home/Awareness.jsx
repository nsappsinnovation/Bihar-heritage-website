import React from "react";
import { motion } from "framer-motion";
import NalandaUniversity from "../../assets/UniqueBiharImg/NalandaUniversity.webp";

// Same background as the updated JoinMovement component (Nalanda Mahavihara - iconic Bihar heritage)
const backgroundImage = NalandaUniversity;

// Carefully selected relevant images for each awareness item
const cardImages = [
  NalandaUniversity, // Heritage Awareness Programme - Iconic Nalanda Mahavihara overview
  "https://cdn.britannica.com/12/94612-050-B4EEB84A/temple-Buddhist-Mahabodhi-Bihar-India-Bodh-Gaya.jpg", // Seminar/Workshop - Mahabodhi Temple (Bihar UNESCO site)
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Women_performing_Jhijhiya_dance.jpg", // Women's Day Special - Traditional Jhijhiya dance by women in Bihar
  "https://worldheritageolympiad.org/uploads/blog/Bihar%20Heritage%20Olympiad_Blog_%20November%2025,%202024%20-%20Copy.jpg", // Slogan Writing Competition - Students at Bihar World Heritage Olympiad event
];

const awarenessItems = [
  {
    title: "Heritage Awareness Programme",
    desc: "Engaging the community to value and preserve cultural heritage through interactive sessions and monument walks.",
    img: cardImages[0],
    num: "01",
  },
  {
    title: "Seminar & Workshops",
    desc: "Expert-led workshops on conservation techniques, research methodologies, and historical relevance of local sites.",
    img: cardImages[1],
    num: "02",
  },
  {
    title: "Women's Day Special",
    desc: "Celebrating women’s contribution in heritage conservation, folklore preservation, storytelling, and local art forms.",
    img: cardImages[2],
    num: "03",
  },
  {
    title: "Slogan Writing Competition",
    desc: "Encouraging creativity among students to raise awareness on cultural preservation and global heritage protection.",
    img: cardImages[3],
    num: "04",
  },
];

const Awareness = () => {
  return (
    <section className="relative py-16 px-6 md:px-12 lg:px-20 bg-brand-alt border-t border-brand-border">
      
      {/* Subtle overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-brand-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: `80px 80px`
        }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Editorial Introduction (Span 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col text-left">
            <span className="text-brand-accent text-xs font-bold tracking-[0.25em] uppercase mb-3 inline-block font-sans">
              Outreach & Engagement
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4 leading-tight">
              Awareness & Education
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-light font-sans leading-relaxed mb-8">
              Spreading knowledge and active community involvement through engaging initiatives, competitive learning, and preservation forums.
            </p>

            {/* In-place Premium Quote Block */}
            <div className="border-l-2 border-brand-accent/50 pl-5 py-2 bg-brand-dark/20 rounded-r-2xl pr-4">
              <p className="text-sm md:text-base text-brand-accent font-serif italic leading-relaxed font-light">
                “Preserving heritage is not just about saving the past; it’s about shaping a future rich in identity, pride, and connection.”
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Column Directory (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {awarenessItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col sm:flex-row gap-5 p-4 rounded-3xl border border-brand-border/40 hover:border-brand-accent/30 bg-white/40 hover:bg-white transition-all duration-300 text-left cursor-default shadow-sm hover:shadow-md"
              >
                {/* Round Image Frame */}
                <div className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden border border-brand-border/60 group-hover:border-brand-accent/30 transition-colors duration-500 relative flex-shrink-0">
                  <img decoding="async"
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.95]"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-brand-dark/95 border border-brand-border/60 text-brand-accent text-[9px] font-bold font-mono px-2 py-0.5 rounded-full select-none">
                    {item.num}
                  </div>
                </div>

                {/* Typography Block */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-serif font-bold text-text-primary group-hover:text-brand-accent transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal font-sans mt-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Awareness;