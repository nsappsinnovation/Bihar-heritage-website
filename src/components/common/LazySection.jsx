import React, { Suspense } from "react";
import { useInView } from "react-intersection-observer";

/**
 * Mounts its (lazy) children only once the placeholder comes within
 * `rootMargin` of the viewport, so below-the-fold sections don't download
 * or render on first load. `eager` skips the wait (e.g. hash navigation).
 */
const LazySection = ({ children, minHeight = "60vh", rootMargin = "400px 0px", eager = false }) => {
  const { ref, inView } = useInView({ rootMargin, triggerOnce: true, skip: eager });
  const show = eager || inView;
  const placeholder = <div style={{ minHeight }} aria-hidden="true" />;

  return (
    <div ref={ref}>
      {show ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
    </div>
  );
};

export default LazySection;
