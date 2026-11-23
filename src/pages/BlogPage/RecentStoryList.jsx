import React from "react";

const RecentStoryList = ({ stories, onOpen }) => {
  if (!stories || stories.length === 0) return null;

  // Take exactly 3 stories
  const listStories = stories.slice(0, 3);

  return (
    <div className="w-full lg:w-[30%] flex flex-col">
      <div className="flex justify-between items-baseline mb-6 border-b border-[#E7DED3] pb-3">
        <h3 className="font-cormorant text-2xl font-bold text-[#2F241D]">
          Recent Stories
        </h3>
        <span className="text-xs font-inter font-semibold tracking-wider text-[#B85C38] uppercase hover:underline cursor-pointer">
          View all
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {listStories.map((story, index) => (
          <div key={story.id}>
            <a
              href={`/blog/${story.slug}`}
              onClick={(e) => {
                e.preventDefault();
                if (onOpen) onOpen(story);
              }}
              className="flex gap-4 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-24 h-16 md:w-28 md:h-20 shrink-0 overflow-hidden rounded-lg border border-[#E7DED3]">
                <img loading="lazy" decoding="async"
                  src={story.thumbnail}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Story Details */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[11px] font-inter font-semibold uppercase tracking-wider text-[#B85C38] mb-1">
                  {story.category}
                </span>
                
                <h4 className="font-cormorant text-base md:text-lg font-bold text-[#2F241D] leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#B85C38]">
                  {story.title}
                </h4>

                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-inter text-[#6F665E] uppercase tracking-wider">
                  <span>{story.publishedAt}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E7DED3]"></span>
                  <span>{story.readingTime}</span>
                </div>
              </div>
            </a>

            {/* Separator - show only between cards */}
            {index < listStories.length - 1 && (
              <hr className="mt-4 border-t border-[#E7DED3]/60" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentStoryList;
