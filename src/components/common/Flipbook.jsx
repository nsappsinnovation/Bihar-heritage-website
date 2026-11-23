import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { ChevronsRight, Loader2, AlertCircle } from "lucide-react";

// Served locally (copied by vite-plugin-static-copy) — no third-party CDN, CSP-safe.
pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf-worker/pdf.worker.min.js`;

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage overflow-hidden bg-white shadow-md flex justify-center items-center" ref={ref}>
      <div>{props.children}</div>
    </div>
  );
});

Pages.displayName = "Pages";

function Flipbook({ pdfFile, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadError(false);
  }

  function onDocumentLoadError(err) {
    console.error("PDF Load Error:", err);
    setLoadError(true);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-2 px-2 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />

      {/* Helper instruction badge */}
      {numPages && (
        <div className="mb-3 z-10 bg-brand-card/90 backdrop-blur-md border border-brand-accent/30 rounded-full px-5 py-1.5 shadow-md flex items-center gap-2">
          <p className="text-text-secondary font-medium text-xs flex items-center gap-2 font-sans tracking-wider">
            <span className="text-brand-accent font-semibold">
              Click or drag pages to flip ({numPages} Pages)
            </span>
            <span className="text-brand-accent animate-pulse flex items-center">
              <ChevronsRight size={16} />
            </span>
          </p>
        </div>
      )}

      {loadError && (
        <div className="flex flex-col items-center justify-center my-12 text-red-400 gap-3 z-20 bg-brand-card p-6 rounded-xl border border-red-500/30">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <span className="text-sm font-semibold font-sans">Failed to render PDF flipbook</span>
          <span className="text-xs text-text-secondary font-sans text-center max-w-sm">
            The document could not be loaded. Please ensure the PDF file is valid or download it directly.
          </span>
        </div>
      )}

      <div className="relative flex-1 w-full flex items-center justify-center overflow-auto p-2">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex flex-col items-center justify-center my-12 text-brand-accent gap-3 z-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
              <span className="text-xs font-sans tracking-wide text-text-secondary">Loading publication flipbook...</span>
            </div>
          }
        >
          {numPages && (
            <HTMLFlipBook
              width={500}
              height={680}
              showCover={true}
              maxShadowOpacity={0.5}
              drawShadow={true}
              className="z-20 shadow-2xl rounded-md my-auto"
            >
              {[...Array(numPages).keys()].map((pNum) => (
                <Pages key={pNum} number={pNum + 1}>
                  <Page
                    pageNumber={pNum + 1}
                    width={500}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Pages>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>
    </div>
  );
}

export default Flipbook;
