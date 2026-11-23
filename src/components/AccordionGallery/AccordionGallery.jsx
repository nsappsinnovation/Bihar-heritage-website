import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { safeHref } from '../../utils/safeUrl';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  accentColor = '#C56A3D',
  overlayColor = '#1a0f00',
  textColor = '#ffffff',
  height = 550,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  brownTint = true,
  className = ''
}) => {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const textRefs = useRef([]);
  const tlRef = useRef(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);
  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const applyLayout = useCallback(
    animate => {
      const panels = panelRefs.current;
      if (!panels.length) return;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];
        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          // Subtle brown sepia tint for inactive images, 0 sepia + extra brightness for active image
          const sepiaVal = brownTint ? (isActive ? 0 : 0.55) : 0;
          const brightVal = isActive ? 1.15 : 0.75;

          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-sepia': sepiaVal,
              '--ag-bright': brightVal,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      brownTint,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = i => {
    if (trigger === 'hover') setActive(i);
  };

  const handleClick = (i, e) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`flex w-full max-w-full [perspective:1400px] [perspective-origin:50%_50%] max-[520px]:flex-col max-[520px]:[perspective:none] max-[520px]:!h-auto ${
        vertical ? 'flex-col' : 'flex-row'
      }${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        gap: `${gap}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link && item.link !== '#' ? 'a' : 'div';

        return (
          <Tag
            key={i}
            ref={el => (panelRefs.current[i] = el)}
            className="relative flex-1 min-w-0 min-h-0 overflow-hidden cursor-pointer block no-underline outline-none [transform-style:preserve-3d] origin-center bg-[#0a0713] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] [will-change:flex-grow,transform] [-webkit-tap-highlight-color:transparent] focus-visible:shadow-[0_0_0_2px_var(--ag-accent),0_10px_30px_-18px_rgba(0,0,0,0.8)] max-[520px]:min-h-[84px] max-[520px]:!transform-none"
            style={{ borderRadius: `${radius}px` }}
            href={item.link && item.link !== '#' ? safeHref(item.link) : undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
              <span
                ref={el => (mediaRefs.current[i] = el)}
                className={`absolute top-1/2 left-1/2 [will-change:transform,filter] ${
                  vertical
                    ? 'w-full h-[var(--ag-media-size)] max-[520px]:w-full max-[520px]:h-[var(--ag-media-size)]'
                    : 'w-[var(--ag-media-size)] h-full max-[520px]:w-full max-[520px]:h-[var(--ag-media-size)]'
                }`}
                style={{
                  filter:
                    'sepia(var(--ag-sepia, 0)) brightness(var(--ag-bright, 1)) saturate(calc(1 + (1 - var(--ag-sepia, 0)) * 0.1))'
                }}
              >
                <img loading="lazy" decoding="async"
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  className="w-full h-full object-cover block select-none pointer-events-none"
                />
              </span>
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--ag-overlay) 78%, transparent) 100%), color-mix(in srgb, var(--ag-overlay) calc(var(--ag-dim, 0.35) * 100%), transparent)'
                }}
                aria-hidden="true"
              />
            </span>

            {showLabels && (
              <span className="absolute left-5 bottom-5 right-5 flex items-center gap-3 pointer-events-none z-10" aria-hidden="true">
                <span
                  ref={el => (barRefs.current[i] = el)}
                  className="shrink-0 w-[3px] h-[26px] rounded-[3px] bg-[var(--ag-accent)] opacity-0 shadow-[0_0_12px_color-mix(in_srgb,var(--ag-accent)_60%,transparent)]"
                />
                <span
                  ref={el => (textRefs.current[i] = el)}
                  className="text-[var(--ag-text)] font-sans font-semibold text-[clamp(1rem,1.4vw,1.4rem)] tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis opacity-0 drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]"
                >
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
