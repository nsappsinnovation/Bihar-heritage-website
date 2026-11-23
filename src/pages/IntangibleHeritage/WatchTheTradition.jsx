import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, X, Film, ExternalLink } from 'lucide-react';
import { safeHref } from '../../utils/safeUrl';

// Extract YouTube Video ID and convert to embed URL. Returns null if no valid video exists.
const getYouTubeEmbedUrl = (video) => {
  if (!video || !video.videoUrl || video.videoStatus !== 'AVAILABLE') return null;
  const url = video.videoUrl;

  // Match standard youtube.com/watch?v=ID or youtube.com/embed/ID or youtu.be/ID
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }

  return null;
};

const VideoCard = ({ video, imageMap, index, inView, onWatch }) => {
  const hasImage = video.imageKey && imageMap[video.imageKey];
  const img = hasImage ? imageMap[video.imageKey] : null;
  const embedUrl = getYouTubeEmbedUrl(video);
  const isAvailable = Boolean(embedUrl);

  return (
    <div
      className="relative overflow-hidden group rounded-2xl transition-all duration-300 hover:border-[#C49A52]/60 hover:shadow-xl"
      style={{
        background: '#1A0C06',
        border: `1px solid ${isAvailable ? 'rgba(196,154,82,0.3)' : 'rgba(196,154,82,0.12)'}`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
        aspectRatio: '16/9',
      }}
    >
      {/* Background image */}
      {img ? (
        <>
          <img loading="lazy" decoding="async"
            src={img}
            alt={video.title}
            data-no-lightbox="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] rounded-2xl"
            style={{ opacity: isAvailable ? 0.45 : 0.35 }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(to top, rgba(20,8,2,0.92) 0%, rgba(20,8,2,0.55) 50%, rgba(20,8,2,0.2) 100%)' }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #2C1608 0%, #1A0C06 100%)' }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
        {/* Category */}
        <span
          className="text-[9px] font-sans font-bold tracking-[0.25em] uppercase mb-3"
          style={{ color: 'rgba(196,154,82,0.6)' }}
        >
          Folk Performance · Bihar
        </span>

        {/* Title */}
        <h3
          className="font-['Playfair_Display','Cinzel',serif] font-bold mb-1"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', color: '#F4E4C1' }}
        >
          {video.title}
        </h3>
        <p
          className="font-['Playfair_Display',serif] italic mb-4"
          style={{ fontSize: '0.85rem', color: 'rgba(244,228,193,0.5)' }}
        >
          {video.subtitle}
        </p>

        {/* Watch button */}
        <div className="flex items-center gap-4">
          {isAvailable ? (
            <button
              onClick={() => onWatch(video)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md group/btn"
              style={{
                border: '1px solid rgba(196,154,82,0.6)',
                background: 'rgba(196,154,82,0.22)',
              }}
              title={`Watch ${video.title}`}
              type="button"
            >
              <div className="w-5 h-5 rounded-full bg-[#C49A52] text-[#1A0C06] flex items-center justify-center transition-transform group-hover/btn:scale-110">
                <Play size={10} fill="#1A0C06" className="ml-0.5" />
              </div>
              <span className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#F4E4C1]">
                Watch Video
              </span>
            </button>
          ) : (
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                border: '1px solid rgba(196,154,82,0.2)',
                background: 'rgba(196,154,82,0.05)',
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
              title="Video documentation coming soon"
            >
              <Play size={10} fill="#C49A52" />
              <span className="text-[10px] font-sans tracking-[0.18em] uppercase" style={{ color: '#C49A52' }}>
                Coming Soon
              </span>
            </div>
          )}
          <span className="text-[9px] font-sans" style={{ color: 'rgba(196,154,82,0.4)' }}>
            · {video.region}
          </span>
        </div>

        {/* Status badge */}
        <span
          className="absolute top-4 right-4 text-[9px] font-sans tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={isAvailable ? {
            background: 'rgba(196,154,82,0.2)',
            border: '1px solid rgba(196,154,82,0.4)',
            color: 'rgba(244,228,193,0.8)',
          } : {
            background: 'rgba(158,63,50,0.2)',
            border: '1px solid rgba(158,63,50,0.3)',
            color: 'rgba(244,228,193,0.5)',
          }}
        >
          {isAvailable ? 'Available' : 'Coming Soon'}
        </span>
      </div>
    </div>
  );
};

const WatchTheTradition = ({ videoTraditions = [], imageMap = {} }) => {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const [selectedVideo, setSelectedVideo] = useState(null);

  const embedUrl = selectedVideo ? getYouTubeEmbedUrl(selectedVideo) : null;
  const anyComingSoon = videoTraditions.some(v => !getYouTubeEmbedUrl(v));

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      ref={ref}
      className="lh-video-section relative py-20 md:py-28 overflow-hidden"
      style={{ background: '#F7EEDC' }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Section heading */}
        <div
          className="mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8" style={{ background: '#A96F45' }} />
            <span className="text-[10px] font-sans font-bold tracking-[0.35em] uppercase" style={{ color: '#A96F45' }}>
              Performance Traditions
            </span>
          </div>
          <h2
            className="font-['Cinzel','Playfair_Display',serif] font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#33251D', letterSpacing: '0.04em' }}
          >
            WATCH THE TRADITION
          </h2>
          <p
            className="mt-4 font-['Playfair_Display',serif] italic max-w-lg"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#5C3A24', opacity: 0.75 }}
          >
            Bihar's performing arts traditions — folk dances, theatre, and ritual performances — are living archives of cultural memory.
          </p>

          {anyComingSoon && (
            <div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ border: '1px solid rgba(169,111,69,0.2)', background: 'rgba(169,111,69,0.05)' }}
            >
              <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0" fill="none" stroke="rgba(169,111,69,0.5)" strokeWidth="1.2">
                <circle cx="6" cy="6" r="5" /><path d="M6 3v4M6 8.5v.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-sans tracking-[0.15em]" style={{ color: 'rgba(169,111,69,0.65)' }}>
                Some video documentation is still being produced.
              </span>
            </div>
          )}
        </div>

        {/* Video grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {videoTraditions.map((video, i) => (
            <div key={video.id} className="w-full">
              <VideoCard
                video={video}
                imageMap={imageMap}
                index={i}
                inView={inView}
                onWatch={setSelectedVideo}
              />
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Video Lightbox Modal */}
      {selectedVideo && embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn">
          {/* Modal Backdrop overlay click */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedVideo(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-4xl bg-[#1A0C06] border border-[#C49A52]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:px-7 md:py-4 border-b border-[#C49A52]/20 bg-[#2C1608]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C49A52]/15 border border-[#C49A52]/40 flex items-center justify-center text-[#F4E4C1]">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base md:text-lg text-[#F4E4C1]">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-xs font-sans text-[#F4E4C1]/60">
                    {selectedVideo.subtitle} • {selectedVideo.region}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#F4E4C1] flex items-center justify-center transition-colors cursor-pointer"
                title="Close Video"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* YouTube Iframe Player */}
            <div className="relative w-full aspect-video bg-black flex-1">
              <iframe
                src={embedUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 md:px-7 md:py-4 bg-[#1A0C06] flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-[#C49A52]/15">
              <p className="text-xs font-sans text-[#F4E4C1]/75 leading-relaxed max-w-2xl">
                {selectedVideo.description || `Traditional ${selectedVideo.title} performance from ${selectedVideo.region}, Bihar.`}
              </p>

              {selectedVideo.videoUrl && (
                <a
                  href={safeHref(selectedVideo.videoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#C49A52] hover:text-[#F4E4C1] transition-colors shrink-0"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WatchTheTradition;
