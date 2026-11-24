import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found | Bihar Heritage";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20 bg-[#FAF8F3] text-center">
      <div className="max-w-md">
        <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#B85C38]">Error 404</p>
        <h1 className="mt-3 font-cinzel text-3xl md:text-4xl text-[#2F241D]">Page not found</h1>
        <p className="mt-4 text-[#6F665E]">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-full bg-[#2F241D] hover:bg-[#B85C38] px-8 py-3 font-cinzel text-xs font-bold tracking-[0.2em] uppercase text-[#F4E4C1] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
