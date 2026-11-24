import React, { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, Pause, Volume2, VolumeX, X, Music, RotateCcw, RotateCw, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

// Placeholder audio for direct playback (self-hosted). Only two tracks are bundled, so
// several entries share one; replace with real recordings in public/audio/ when available.
const SAMPLE_AUDIO_STREAMS = {
  "chaita-audio": "/audio/audio-d0a13f69d2-cf06c7b7.mp3",
  "sohar-audio": "/audio/audio-1808fbf07a-07073f03.mp3",
  "kajari-audio": "/audio/audio-1808fbf07a-07073f03.mp3",
  "hori-audio": "/audio/audio-d0a13f69d2-cf06c7b7.mp3",
  "chhath-geet-audio": "/audio/audio-d0a13f69d2-cf06c7b7.mp3",
  "ropni-geet-audio": "/audio/audio-1808fbf07a-07073f03.mp3",
  "katni-geet-audio": "/audio/audio-1808fbf07a-07073f03.mp3",
  "vivah-geet-audio": "/audio/audio-d0a13f69d2-cf06c7b7.mp3",
};

const DEFAULT_AUDIO_STREAM = "/audio/audio-1808fbf07a-07073f03.mp3";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const WaveformSVG = ({ active = false, isPlaying = false }) => {
  const bars = [3, 8, 14, 10, 18, 22, 16, 12, 20, 24, 18, 14, 10, 16, 22, 18, 12, 8, 14, 10, 6, 12, 18, 14, 8];
  return (
    <svg viewBox="0 0 80 32" style={{ width: 80, height: 32, opacity: active ? 0.9 : 0.4 }}>
      {bars.map((h, i) => {
        const animatedHeight = isPlaying ? Math.max(4, (h * (0.4 + (i % 5) * 0.15))) : h;
        return (
          <rect
            key={i}
            x={i * 3 + i * 0.2}
            y={(32 - animatedHeight) / 2}
            width={2.5}
            height={animatedHeight}
            rx={1}
            fill={active ? '#F4E4C1' : '#C49A52'}
            className={isPlaying ? 'transition-all duration-300' : ''}
          />
        );
      })}
    </svg>
  );
};

const HearTheHeritage = ({ audioTraditions = [] }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const carouselRef = useRef(null);
  
  // Audio player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);

  // Carousel scroll handler
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Play next / previous track in list
  const playNextTrack = () => {
    if (!currentTrack || audioTraditions.length === 0) return;
    const currentIndex = audioTraditions.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % audioTraditions.length;
    handleTogglePlay(audioTraditions[nextIndex]);
  };

  const playPrevTrack = () => {
    if (!currentTrack || audioTraditions.length === 0) return;
    const currentIndex = audioTraditions.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + audioTraditions.length) % audioTraditions.length;
    handleTogglePlay(audioTraditions[prevIndex]);
  };

  // Get valid audio URL for HTML5 player
  const getPlayableUrl = (track) => {
    if (!track) return DEFAULT_AUDIO_STREAM;
    if (track.audioUrl && track.audioUrl.endsWith('.mp3')) return track.audioUrl;
    return SAMPLE_AUDIO_STREAMS[track.id] || DEFAULT_AUDIO_STREAM;
  };

  // Play or pause a track
  const handleTogglePlay = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.src = getPlayableUrl(track);
        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
          console.warn("Audio playback issue:", err);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const skipTime = (secs) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(Math.max(audioRef.current.currentTime + secs, 0), duration);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <section
      ref={ref}
      className="lh-audio-section relative py-20 md:py-28 overflow-hidden"
      style={{ background: '#2C1608' }}
    >
      {/* Background radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(196,154,82,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='0.6' fill='%23C49A52' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => playNextTrack()}
        preload="metadata"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header with Carousel Navigation Arrows */}
        <div
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8" style={{ background: 'rgba(196,154,82,0.6)' }} />
              <span className="text-[10px] font-sans font-bold tracking-[0.35em] uppercase" style={{ color: 'rgba(196,154,82,0.7)' }}>
                Folk Music Traditions
              </span>
            </div>
            <h2
              className="font-['Cinzel','Playfair_Display',serif] font-bold"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F4E4C1', letterSpacing: '0.04em' }}
            >
              HEAR THE HERITAGE
            </h2>
            <p
              className="mt-4 font-['Playfair_Display',serif] italic max-w-lg"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(244,228,193,0.6)' }}
            >
              Bihar's folk music traditions carry centuries of emotion, ritual, and daily life in every note. Click any card to listen directly.
            </p>
          </div>

          {/* Carousel Navigation Arrow Buttons */}
          <div className="flex items-center gap-3 self-end">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-11 h-11 rounded-full border border-[#C49A52]/40 bg-[#C49A52]/10 hover:bg-[#C49A52] text-[#F4E4C1] hover:text-[#2C1608] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
              title="Previous Cards"
              type="button"
              aria-label="Previous Cards"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-11 h-11 rounded-full border border-[#C49A52]/40 bg-[#C49A52]/10 hover:bg-[#C49A52] text-[#F4E4C1] hover:text-[#2C1608] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
              title="Next Cards"
              type="button"
              aria-label="Next Cards"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Audio Tradition Cards Container with Scroll Overlay Controls */}
        <div className="relative group">
          {/* Direct Left & Right Floating Arrow Overlay for Cards */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#2C1608]/90 border border-[#C49A52]/60 text-[#F4E4C1] hover:bg-[#C49A52] hover:text-[#2C1608] flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Previous"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#2C1608]/90 border border-[#C49A52]/60 text-[#F4E4C1] hover:bg-[#C49A52] hover:text-[#2C1608] flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Next"
            type="button"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-6 no-scrollbar scroll-smooth"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.9s ease 0.25s' }}
          >
            {audioTraditions.map((audio, i) => {
              const isThisPlaying = currentTrack?.id === audio.id && isPlaying;
              const isThisSelected = currentTrack?.id === audio.id;

              return (
                <div
                  key={audio.id}
                  className="flex-shrink-0 rounded-2xl transition-all duration-300 hover:border-[#C49A52]"
                  style={{
                    width: 'clamp(240px, 28vw, 300px)',
                    background: isThisSelected ? 'rgba(196,154,82,0.15)' : 'rgba(255,249,238,0.08)',
                    border: `1px solid ${isThisSelected ? '#C49A52' : 'rgba(196,154,82,0.22)'}`,
                    boxShadow: isThisSelected ? '0 8px 25px -5px rgba(196,154,82,0.25)' : 'none',
                    padding: '20px',
                    animation: inView ? `fadeInMarker 0.5s ease ${i * 0.08}s both` : 'none',
                  }}
                >
                  <span
                    className="text-[9px] font-sans font-bold tracking-[0.25em] uppercase block mb-4"
                    style={{ color: 'rgba(196,154,82,0.5)' }}
                  >
                    Folk Music · Bihar
                  </span>

                  <h3
                    className="font-['Playfair_Display',serif] font-bold mb-1"
                    style={{ fontSize: '1.15rem', color: '#F4E4C1' }}
                  >
                    {audio.title}
                  </h3>
                  <p
                    className="font-['Playfair_Display',serif] italic mb-5"
                    style={{ fontSize: '0.85rem', color: 'rgba(244,228,193,0.55)' }}
                  >
                    {audio.subtitle}
                  </p>

                  {/* Play Button + Waveform */}
                  <div className="flex items-center gap-4 mb-5">
                    <button
                      onClick={() => handleTogglePlay(audio)}
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer shadow-md"
                      style={{
                        border: isThisSelected ? '1px solid #F4E4C1' : '1px solid rgba(196,154,82,0.55)',
                        background: isThisPlaying ? '#C49A52' : 'rgba(196,154,82,0.25)',
                        color: isThisPlaying ? '#2C1608' : '#F4E4C1',
                      }}
                      title={isThisPlaying ? `Pause ${audio.title}` : `Play ${audio.title}`}
                      type="button"
                    >
                      {isThisPlaying ? (
                        <Pause size={18} fill="#2C1608" />
                      ) : (
                        <Play size={18} fill="#F4E4C1" className="ml-0.5" />
                      )}
                    </button>
                    <WaveformSVG active={isThisSelected} isPlaying={isThisPlaying} />
                  </div>

                  <p
                    className="font-sans leading-relaxed mb-5"
                    style={{
                      fontSize: '0.78rem',
                      color: 'rgba(244,228,193,0.6)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {audio.description}
                  </p>

                  <div className="pt-4 space-y-1.5" style={{ borderTop: '1px solid rgba(196,154,82,0.12)' }}>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 10 10" style={{ width: 9, height: 9, opacity: 0.4 }}>
                        <path d="M5 1C3.34 1 2 2.34 2 4c0 2 3 6 3 6s3-4 3-6c0-1.66-1.34-3-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z" fill="#C49A52" />
                      </svg>
                      <span className="text-[10px] font-sans" style={{ color: 'rgba(196,154,82,0.45)' }}>{audio.region}</span>
                    </div>
                    {audio.instruments && (
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="rgba(196,154,82,0.4)" strokeWidth="1">
                          <path d="M3 1l5 4-5 4V1z" />
                        </svg>
                        <span className="text-[10px] font-sans" style={{ color: 'rgba(196,154,82,0.45)' }}>{audio.instruments}</span>
                      </div>
                    )}
                    {isThisPlaying && (
                      <span
                        className="inline-block mt-2 text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full animate-pulse"
                        style={{ background: '#C49A52', color: '#2C1608' }}
                      >
                        Now Playing
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Audio Player Bar */}
      {currentTrack && (
        <div
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 z-50 p-4 md:px-6 md:py-3.5 rounded-2xl backdrop-blur-md transition-all duration-500 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border"
          style={{
            background: 'rgba(44, 22, 8, 0.92)',
            borderColor: 'rgba(196, 154, 82, 0.4)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Left: Track Details */}
          <div className="flex items-center gap-3.5 w-full md:w-auto shrink-0">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center border border-[#C49A52]/40 bg-[#C49A52]/10 ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              <Music className="w-5 h-5 text-[#F4E4C1]" />
            </div>
            <div className="overflow-hidden max-w-[200px] md:max-w-[240px]">
              <h4 className="text-sm font-serif font-bold text-[#F4E4C1] truncate">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] font-sans text-[#F4E4C1]/60 truncate">
                {currentTrack.subtitle} • {currentTrack.region}
              </p>
            </div>
          </div>

          {/* Center: Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full max-w-md">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={playPrevTrack}
                className="text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors p-1"
                title="Previous Track"
                type="button"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipTime(-10)}
                className="text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors p-1"
                title="Rewind 10s"
                type="button"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleTogglePlay(currentTrack)}
                className="w-10 h-10 rounded-full bg-[#C49A52] hover:bg-[#d4a95c] text-[#2C1608] flex items-center justify-center transition-transform hover:scale-105 shadow-md"
                title={isPlaying ? "Pause" : "Play"}
                type="button"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => skipTime(10)}
                className="text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors p-1"
                title="Forward 10s"
                type="button"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={playNextTrack}
                className="text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors p-1"
                title="Next Track"
                type="button"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Bar */}
            <div className="flex items-center gap-2.5 w-full">
              <span className="text-[10px] font-mono text-[#F4E4C1]/60 w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#C49A52]/20 accent-[#C49A52] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#F4E4C1]/60 w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Volume & Close */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors"
                type="button"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-[#C49A52]/20 accent-[#C49A52] rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={closePlayer}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#F4E4C1]/70 hover:text-[#F4E4C1] transition-colors"
              title="Close player"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HearTheHeritage;
