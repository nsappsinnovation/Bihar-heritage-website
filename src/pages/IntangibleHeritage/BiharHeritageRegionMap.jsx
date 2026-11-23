import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

/*
  Simplified artistic SVG map of Bihar with 7 cultural regions.
  The outer Bihar polygon is a stylised approximation.
  Clicking a region filters the heritage grid.
*/

// Bihar outer boundary (simplified polygon, 520×380 viewBox)
const BIHAR_PATH = "M 28 88 L 60 28 L 175 18 L 310 18 L 495 30 L 510 190 L 495 295 L 405 362 L 310 368 L 185 362 L 95 368 L 48 310 L 28 210 Z";

// Cultural zone clickable paths (rough artistic regions)
const ZONES = [
  {
    id: 'champaran',
    label: 'Champaran',
    labelShort: 'Champaran',
    cx: 102, cy: 90,
    color: '#7B8F5D',
    path: "M 28 88 L 60 28 L 175 18 L 175 160 L 80 155 L 48 150 Z",
  },
  {
    id: 'mithilanchal',
    label: 'Mithilanchal',
    labelShort: 'Mithilanchal',
    cx: 340, cy: 85,
    color: '#C49A52',
    path: "M 175 18 L 310 18 L 495 30 L 510 190 L 415 195 L 290 185 L 200 180 L 175 160 Z",
  },
  {
    id: 'vajji',
    label: 'Vajji',
    labelShort: 'Vajji',
    cx: 178, cy: 195,
    color: '#B8845C',
    path: "M 80 155 L 175 160 L 200 180 L 195 265 L 120 265 L 80 240 Z",
  },
  {
    id: 'magadha',
    label: 'Magadha',
    labelShort: 'Magadha',
    cx: 265, cy: 270,
    color: '#5C3A24',
    path: "M 195 265 L 290 185 L 415 195 L 410 300 L 335 310 L 220 310 Z",
  },
  {
    id: 'bhojpur',
    label: 'Bhojpur',
    labelShort: 'Bhojpur',
    cx: 100, cy: 305,
    color: '#9E3F32',
    path: "M 48 310 L 80 240 L 120 265 L 195 265 L 220 310 L 185 362 L 95 368 Z",
  },
  {
    id: 'gaya',
    label: 'Gaya',
    labelShort: 'Gaya',
    cx: 275, cy: 345,
    color: '#7A6B5A',
    path: "M 220 310 L 335 310 L 355 362 L 310 368 L 185 362 Z",
  },
  {
    id: 'anga',
    label: 'Anga',
    labelShort: 'Anga',
    cx: 435, cy: 280,
    color: '#A96F45',
    path: "M 415 195 L 510 190 L 495 295 L 405 362 L 355 362 L 335 310 L 410 300 Z",
  },
];

// Ganga river path (stylised)
const GANGA_PATH = "M 48 220 Q 130 205 200 210 Q 290 215 380 205 Q 440 200 510 195";

// Heritage counts per region
const getRegionCount = (heritages, regionId) =>
  heritages.filter((h) => h.regions?.includes(regionId)).length;

const BiharHeritageRegionMap = ({ heritages, activeRegion, onRegionClick }) => {
  const [hoveredZone, setHoveredZone] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="lh-map-section relative py-16 md:py-24 overflow-hidden"
      style={{ background: '#FFF9EE' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='0.7' fill='%23C49A52' opacity='0.09'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section heading */}
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8" style={{ background: '#A96F45' }} />
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase" style={{ color: '#A96F45' }}>
              Regional Heritage
            </span>
          </div>
          <h2
            className="font-['Playfair_Display','Cinzel',serif] font-bold leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', color: '#33251D' }}
          >
            Heritage Across Bihar
          </h2>
          <p className="mt-3 font-sans max-w-lg" style={{ fontSize: '0.9rem', color: '#5C3A24', opacity: 0.75 }}>
            Select a cultural region to explore the traditions of that area.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* SVG Map */}
          <div
            className="w-full lg:w-[58%] flex-shrink-0"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
            }}
          >
            <div
              className="relative rounded-none"
              style={{
                background: 'linear-gradient(135deg, #F2E8D5 0%, #ECD9B5 100%)',
                border: '1px solid rgba(196,154,82,0.3)',
                padding: '12px',
              }}
            >
              <svg
                viewBox="0 0 538 400"
                className="w-full"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(33,18,8,0.12))' }}
              >
                {/* Outer Bihar border faint fill */}
                <path d={BIHAR_PATH} fill="rgba(196,154,82,0.06)" stroke="rgba(196,154,82,0.5)" strokeWidth="1.5" />

                {/* Cultural zone paths */}
                {ZONES.map((zone) => {
                  const isActive = activeRegion === zone.id;
                  const isHovered = hoveredZone === zone.id;
                  return (
                    <path
                      key={zone.id}
                      d={zone.path}
                      fill={isActive || isHovered ? zone.color : `${zone.color}30`}
                      stroke={zone.color}
                      strokeWidth={isActive ? 2 : 1}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill 0.3s ease, stroke-width 0.2s ease',
                        opacity: isActive ? 1 : isHovered ? 0.85 : 0.7,
                      }}
                      onClick={() => onRegionClick(isActive ? null : zone.id)}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    />
                  );
                })}

                {/* Ganga River */}
                <path
                  d={GANGA_PATH}
                  fill="none"
                  stroke="rgba(100,149,237,0.45)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="6 3"
                />
                {/* Ganga label */}
                <text x="160" y="198" fontSize="7" fill="rgba(100,149,237,0.7)" fontFamily="serif" fontStyle="italic" letterSpacing="1">
                  Ganga River
                </text>

                {/* Zone labels */}
                {ZONES.map((zone) => {
                  const isActive = activeRegion === zone.id;
                  const count = getRegionCount(heritages, zone.id);
                  return (
                    <g
                      key={`label-${zone.id}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onRegionClick(isActive ? null : zone.id)}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    >
                      {/* Zone name */}
                      <text
                        x={zone.cx}
                        y={zone.cy}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="Cinzel, serif"
                        fontWeight="bold"
                        fill={isActive ? '#FFF9EE' : zone.color}
                        letterSpacing="0.5"
                        style={{ pointerEvents: 'none' }}
                      >
                        {zone.labelShort}
                      </text>
                      {/* Count badge */}
                      <text
                        x={zone.cx}
                        y={zone.cy + 11}
                        textAnchor="middle"
                        fontSize="7"
                        fontFamily="sans-serif"
                        fill={isActive ? '#F4E4C1' : '#5C3A24'}
                        opacity="0.7"
                        style={{ pointerEvents: 'none' }}
                      >
                        {count} traditions
                      </text>
                    </g>
                  );
                })}

                {/* Outer border again on top */}
                <path d={BIHAR_PATH} fill="none" stroke="rgba(92,58,36,0.35)" strokeWidth="1.5" />
              </svg>

              {/* Map caption */}
              <p className="text-center text-[9px] font-sans tracking-[0.2em] uppercase mt-3" style={{ color: '#A96F45', opacity: 0.6 }}>
                Cultural Regions of Bihar — Click to filter heritage
              </p>
            </div>
          </div>

          {/* Region legend / info panel */}
          <div
            className="w-full lg:w-[42%]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
            }}
          >
            {activeRegion ? (
              /* Active region detail */
              <div>
                {ZONES.filter(z => z.id === activeRegion).map(zone => (
                  <div key={zone.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-4 h-4 flex-shrink-0" style={{ background: zone.color }} />
                      <h3
                        className="font-['Playfair_Display',serif] font-bold"
                        style={{ fontSize: '1.6rem', color: '#33251D' }}
                      >
                        {zone.label}
                      </h3>
                    </div>
                    <p className="font-sans text-sm mb-4 leading-relaxed" style={{ color: '#5C3A24', opacity: 0.75 }}>
                      Explore the intangible cultural traditions from the <strong>{zone.label}</strong> region of Bihar.
                    </p>
                    <p
                      className="font-['Playfair_Display',serif] italic text-base mb-6"
                      style={{ color: '#A96F45' }}
                    >
                      {getRegionCount(heritages, activeRegion)} living traditions found
                    </p>
                    <button
                      onClick={() => onRegionClick(null)}
                      className="text-[11px] font-sans tracking-[0.18em] uppercase flex items-center gap-2 transition-opacity hover:opacity-100"
                      style={{ color: '#9E3F32', opacity: 0.75 }}
                    >
                      ← View all regions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* All regions list */
              <div>
                <p
                  className="font-sans mb-6 leading-relaxed"
                  style={{ fontSize: '0.9rem', color: '#5C3A24', opacity: 0.75 }}
                >
                  Bihar's intangible cultural heritage reflects the distinct character of each cultural zone — from the Mithila paintings of the north to the folk theatre of Bhojpur in the west.
                </p>
                <div className="space-y-3">
                  {ZONES.map((zone) => {
                    const count = getRegionCount(heritages, zone.id);
                    return (
                      <button
                        key={zone.id}
                        onClick={() => onRegionClick(zone.id)}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                        className="w-full flex items-center justify-between p-3 text-left transition-all duration-200 group"
                        style={{
                          background: hoveredZone === zone.id ? `${zone.color}12` : 'transparent',
                          border: `1px solid ${hoveredZone === zone.id ? zone.color + '40' : 'rgba(196,154,82,0.15)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 flex-shrink-0" style={{ background: zone.color, opacity: 0.8 }} />
                          <span
                            className="text-sm font-sans font-medium transition-colors"
                            style={{ color: hoveredZone === zone.id ? zone.color : '#5C3A24' }}
                          >
                            {zone.label}
                          </span>
                        </div>
                        <span
                          className="text-[11px] font-sans tracking-[0.1em]"
                          style={{ color: '#A96F45', opacity: 0.7 }}
                        >
                          {count} traditions
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiharHeritageRegionMap;
