import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ImageLightboxContext = createContext(null);

export const useImageLightbox = () => {
  const context = useContext(ImageLightboxContext);
  if (!context) {
    throw new Error("useImageLightbox must be used within an ImageLightboxProvider");
  }
  return context;
};

export const ImageLightboxProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Reset zoom and transforms
  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setIsFlipped(false);
    setPan({ x: 0, y: 0 });
  }, []);

  // Open modal with specific clicked image
  const openLightbox = useCallback((item) => {
    let imgObj = null;
    if (typeof item === "string") {
      imgObj = { src: item, alt: "", title: "" };
    } else if (item && typeof item === "object") {
      imgObj = item;
    }

    if (imgObj && imgObj.src) {
      setCurrentImage(imgObj);
      resetTransform();
      setIsOpen(true);
    }
  }, [resetTransform]);

  // Close modal
  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    resetTransform();
  }, [resetTransform]);

  // Zoom helpers
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(Number((prev + 0.5).toFixed(1)), 4));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(1)), 1);
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const rotateClockwise = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Global document click interceptor for automatic image detection
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Find closest img element
      const targetImg = e.target.closest("img");
      if (!targetImg) return;

      // Ignore conditions:
      // 1. Explicit no-lightbox flag or class
      if (targetImg.closest("[data-no-lightbox='true']") || targetImg.classList.contains("no-lightbox")) {
        return;
      }
      // 2. Leaflet map tiles, markers, layers
      if (
        targetImg.classList.contains("leaflet-tile") ||
        targetImg.classList.contains("leaflet-marker-icon") ||
        targetImg.closest(".leaflet-container")
      ) {
        return;
      }
      // 3. Inside contenteditable or input/form controls
      if (targetImg.closest("[contenteditable='true']") || targetImg.closest("input, textarea")) {
        return;
      }
      // 4. Inside the lightbox modal itself
      if (targetImg.closest("#bihar-heritage-lightbox-modal")) {
        return;
      }
      // 5. Tiny icons (e.g. natural or client width & height <= 28px)
      const rect = targetImg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.width <= 28 && rect.height <= 28) {
        return;
      }

      const src = targetImg.currentSrc || targetImg.src;
      if (!src || src.startsWith("data:image/svg+xml")) return;

      // Prevent parent link navigation to open the full image in big box
      e.preventDefault();
      e.stopPropagation();

      const imageItem = {
        src,
        alt: targetImg.alt || "",
        title: targetImg.title || targetImg.getAttribute("aria-label") || targetImg.alt || "Heritage Visual",
        dataset: { ...targetImg.dataset },
      };

      setCurrentImage(imageItem);
      resetTransform();
      setIsOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, [resetTransform]);

  const value = {
    isOpen,
    currentImage,
    zoom,
    rotation,
    isFlipped,
    pan,
    setPan,
    setZoom,
    setRotation,
    setIsFlipped,
    openLightbox,
    closeLightbox,
    zoomIn,
    zoomOut,
    rotateClockwise,
    toggleFlip,
    resetTransform,
  };

  return (
    <ImageLightboxContext.Provider value={value}>
      {children}
    </ImageLightboxContext.Provider>
  );
};
