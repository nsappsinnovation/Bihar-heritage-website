import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { blogData } from "./mockData";
import FeaturedArticle from "./FeaturedArticle";
import FilterChips from "./FilterChips";
import SearchBar from "./SearchBar";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const featuredStory = blogData.featuredStory;
  const allArticles = blogData.articles;

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle category change
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filtering Logic
  const filteredArticles = allArticles.filter((article) => {
    const matchesCategory =
      activeCategory === "All" ||
      article.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Exclude featured story from the grid to avoid duplication on the main view
  const gridArticles = filteredArticles.filter(article => article.id !== featuredStory.id);

  // Pagination Logic
  const totalPages = Math.ceil(gridArticles.length / pageSize);
  const paginatedArticles = gridArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C2C2C] pb-28 relative overflow-hidden">
      {/* Ambient warm radial glows */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#C56A3D]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#C2A55D]/6 blur-[80px] pointer-events-none" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C56A3D 1px, transparent 0)`,
          backgroundSize: `36px 36px`,
        }}
      />

      <div className="max-w-[calc((100%+1280px)/2)] mx-auto px-6 md:px-12 pt-32 relative z-10">

        {/* ── Page Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-[2px] bg-[#C56A3D] rounded-full" />
            <span className="text-[#C56A3D] text-[10px] md:text-xs font-sans uppercase tracking-[0.3em] font-bold">
              Bihar Heritage
            </span>
          </div>
          <h1 className="font-cormorant text-5xl md:text-[68px] font-bold text-[#2C2C2C] mb-5 leading-tight tracking-tight">
            Blog &amp;{" "}
            <span className="italic text-[#C56A3D]">Articles</span>
          </h1>
          <p className="text-[#5A5A5A] text-sm md:text-base font-sans font-light max-w-xl leading-relaxed">
            Explore in-depth stories, conservation updates, and cultural insights from across Bihar's rich heritage landscape.
          </p>
        </motion.div>

        {/* ── Filters & Search ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-12 border-b border-[#E8DFC8]"
        >
          <FilterChips
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />
        </motion.div>

        {/* ── SECTION 1: Featured Story ─────────────────────────── */}
        {featuredStory && activeCategory === "All" && !searchQuery && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <FeaturedArticle article={featuredStory} />
          </motion.section>
        )}

        {/* ── SECTION 2: Article Grid ───────────────────────────── */}
        <section id="all-articles" className="space-y-10">
          {/* Section eyebrow */}
          <div className="flex items-end justify-between border-b border-[#E8DFC8] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-[#C56A3D] rounded-full" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#C56A3D]">
                  Latest Insights
                </span>
              </div>
              <h2 className="font-cormorant text-3xl md:text-[42px] font-bold text-[#2C2C2C] tracking-tight leading-tight">
                {activeCategory === "All" ? "All Articles" : activeCategory}
              </h2>
            </div>
            {gridArticles.length > 0 && (
              <span className="text-xs font-sans text-[#8A8A8A] font-medium hidden md:block">
                {gridArticles.length} article{gridArticles.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Article Grid or Empty State */}
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BlogCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[24px] border border-[#E8DFC8] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#C56A3D]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-[#C56A3D] text-xl">✦</span>
              </div>
              <p className="font-cormorant text-2xl font-bold text-[#2C2C2C] mb-2">
                No Articles Found
              </p>
              <p className="text-sm text-[#8A8A8A] font-sans mb-6">
                No articles match your current filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-[#C56A3D] text-white hover:bg-[#A94E2F] transition-colors duration-300 cursor-pointer shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-10 border-t border-[#E8DFC8]/60">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  const el = document.getElementById("all-articles");
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 40;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default BlogPage;
