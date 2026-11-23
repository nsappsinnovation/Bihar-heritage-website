import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Info,
} from "lucide-react";
import { useImageLightbox } from "../../context/ImageLightboxContext";

const ImageLightboxModal = () => {
  const {
    isOpen,
    currentImage,
    closeLightbox,
    resetTransform,
  } = useImageLightbox();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading & error on image change
  useEffect(() => {
    if (currentImage) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentImage?.src]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox]);

  // Download image handler
  const handleDownload = async () => {
    if (!currentImage?.src) return;
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = (currentImage.title || currentImage.alt || "bihar-heritage-photo")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      link.download = `${cleanName || "bihar-heritage"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement("a");
      link.href = currentImage.src;
      link.target = "_blank";
      link.download = "bihar-heritage.jpg";
      link.click();
    }
  };

  if (!isOpen || !currentImage) return null;

  const displayTitle = currentImage.title || currentImage.alt || "Heritage Visual";
  const displayAlt = currentImage.alt || currentImage.title || "";

  return (
    <AnimatePresence>
      <div
        id="bihar-heritage-lightbox-modal"
        className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/92 backdrop-blur-2xl text-white select-none overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/* Top Floating Glass Header / Toolbar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="relative z-30 flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto"
        >
          {/* Left: Image Title */}
          <div className="flex items-center gap-3 max-w-[50%] md:max-w-[45%] min-w-0">
            <div className="truncate">
              <h3 className="text-xs md:text-sm font-serif font-semibold text-white/95 truncate">
                {displayTitle}
              </h3>
              {displayAlt && displayAlt !== displayTitle && (
                <p className="text-[10px] text-white/60 font-sans truncate hidden sm:block">
                  {displayAlt}
                </p>
              )}
            </div>
          </div>

          {/* Center/Right: Action Toolbars */}
          <div className="flex items-center gap-2">
            {/* Download */}
            <button
              onClick={handleDownload}
              title="Download Photo"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10 shadow-sm cursor-pointer"
              aria-label="Download Image"
            >
              <Download size={16} />
            </button>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              title="Close (Esc)"
              className="p-2 sm:p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 active:scale-95 transition-all text-white shadow-lg border border-white/20 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={18} />
            </button>
          </div>
        </motion.header>

        {/* Center Main Stage (Image Canvas) */}
        <main
          className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-8"
          onClick={(e) => {
            // Clicking background outside image closes modal
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
        >
          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
              <div className="w-10 h-10 border-3 border-brand-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-sans text-white/70 tracking-wider uppercase font-medium">
                Loading Visual...
              </span>
            </div>
          )}

          {/* Error Message */}
          {hasError && (
            <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-md text-center">
              <Info className="w-10 h-10 text-brand-accent mb-3" />
              <h4 className="font-serif text-lg font-bold text-white mb-1">Image Preview Unavailable</h4>
              <p className="text-xs text-white/60 font-sans mb-4">
                The image resource could not be loaded at this time.
              </p>
              <button
                onClick={resetTransform}
                className="px-4 py-1.5 rounded-lg bg-brand-accent text-white text-xs font-sans font-medium hover:bg-brand-accent-hover transition-colors"
              >
                Reset
              </button>
            </div>
          )}

          {/* Active Image */}
          {!hasError && (
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img loading="lazy" decoding="async"
                src={currentImage.src}
                alt={displayAlt}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className={`max-w-[94vw] md:max-w-[88vw] max-h-[78vh] md:max-h-[82vh] object-contain rounded-lg shadow-2xl border border-white/15 transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                draggable={false}
              />
            </div>
          )}
        </main>

        {/* Bottom Floating Info & Shortcuts Footer */}
        <footer className="relative z-30 flex flex-col bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 md:px-6 text-[11px] text-white/70 font-sans border-t border-white/10">
            <div className="flex items-center gap-2 max-w-[65%] truncate">
              <span className="font-serif font-semibold text-brand-gold truncate">
                {displayTitle}
              </span>
              {currentImage.alt && currentImage.alt !== displayTitle && (
                <span className="hidden md:inline text-white/50 truncate">
                  • {currentImage.alt}
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[10px] text-white/50 font-mono">
              <span>Esc to close</span>
            </div>
          </div>
        </footer>
      </div>
    </AnimatePresence>
  );
};

export default ImageLightboxModal;
