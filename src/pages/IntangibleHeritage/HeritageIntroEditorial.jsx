import React from 'react';
import { useInView } from 'react-intersection-observer';
import { heritageImageMap } from './heritageImages';

const TILES = [
  { img: heritageImageMap['manjusha-art'], title: 'Manjusha Art', tag: 'Art & Craft', area: 'md:col-start-1 md:row-span-2' },
  { img: heritageImageMap['bhagalpur-silk'], title: 'Bhagalpur Silk', tag: 'Weaving', area: '' },
  { img: heritageImageMap['dance-heritage'], title: 'Folk Dance', tag: 'Dance & Theatre', area: '' },
  { img: heritageImageMap['litti-chokha'], title: 'Litti Chokha', tag: 'Food & Customs', area: 'md:col-span-2' },
];

const reveal = (inView, delay) => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(28px)',
  transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
});

const Tile = ({ tile }) => (
  <figure
    className={`group relative min-h-[180px] overflow-hidden rounded-[20px] ring-1 ring-[#E8DCC6] shadow-[0_14px_34px_-16px_rgba(51,37,29,0.45)] ${tile.area}`}
  >
    <img
      src={tile.img}
      alt={tile.title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
      <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.22em] text-[#F4D9A8]">
        {tile.tag}
      </span>
      <span className="font-['Playfair_Display',serif] text-base font-bold text-white">{tile.title}</span>
    </figcaption>
  </figure>
);

const HeritageIntroEditorial = () => {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  const scrollToExplorer = () =>
    document.getElementById('heritage-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section
      ref={ref}
      className="lh-intro relative overflow-hidden py-20 md:py-28"
      style={{ background: '#FFF9EE' }}
    >
      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#E9C99A]/25 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:px-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* LEFT: copy */}
        <div style={reveal(inView, 0.1)}>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#A96F45]" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#A96F45]">
              Living Traditions
            </span>
          </div>

          <h2
            className="font-['Playfair_Display',serif] font-bold leading-[1.05] text-[#33251D]"
            style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.9rem)', letterSpacing: '-0.02em' }}
          >
            A Culture <span className="italic text-[#A96F45]">That Lives</span>
          </h2>

          <p className="mt-7 font-sans text-[1.02rem] leading-[1.85] text-[#5C3A24]">
            Bihar's heritage is not only found in monuments and historic sites. It lives in
            harvest songs, rituals beside the river, stories passed through generations,
            intricate paintings, folk theatre and the everyday practices that shape
            communities across the state.
          </p>
          <p className="mt-4 font-sans text-[1.02rem] leading-[1.85] text-[#5C3A24]/80">
            Carried not in stone but in living memory and collective practice, this
            intangible heritage is the soul of Bihar — celebrated and preserved by
            communities in every region.
          </p>

          <button
            type="button"
            onClick={scrollToExplorer}
            className="group mt-8 inline-flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#A96F45] hover:text-[#7A4A2A] transition-colors"
          >
            Explore the traditions
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>

        {/* RIGHT: bento grid */}
        <div
          className="grid grid-cols-2 gap-4 md:h-[500px] md:grid-cols-[1.1fr_1fr] md:grid-rows-[1fr_1fr_0.85fr]"
          style={reveal(inView, 0.3)}
        >
          {TILES.map((tile) => (
            <Tile key={tile.title} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageIntroEditorial;
