/**
 * Blog Templates Definition & Structure Registry
 * Provides 5 distinct, highly professional editorial structures for blog posts.
 * Uses clean, working HTTPS web image URL links.
 */

export const BIHAR_PRESET_IMAGES = [
  {
    name: "Mahabodhi Temple",
    url: "https://www.trawell.in/admin/images/upload/004883325Bodhgaya_Mahabodhi_Temple_Main.jpg"
  },
  {
    name: "Nalanda Mahavihara",
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?w=1200&auto=format&fit=crop"
  },
  {
    name: "Golghar Granary",
    url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop"
  },
  {
    name: "Kesariya Stupa",
    url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop"
  },
  {
    name: "Vikramshila Ruins",
    url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop"
  },
  {
    name: "Rohtasgarh Fort",
    url: "https://images.unsplash.com/photo-1609946782780-6161a5d03c37?w=1200&auto=format&fit=crop"
  },
  {
    name: "Barabar Caves",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop"
  },
  {
    name: "Takht Sri Patna Sahib",
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop"
  }
];

export const BLOG_TEMPLATES = [
  {
    id: "editorial-journal",
    title: "Editorial Journal",
    tagline: "Classic Editorial & Essay",
    badge: "Narrative & Depth",
    description: "Ideal for deep-dive research stories, historical context, and scholarly essays with a featured lead and quotes.",
    themeColor: "from-amber-600 to-stone-800",
    iconName: "BookOpen",
    coverImage: "https://www.trawell.in/blog/wp-content/uploads/2022/01/Mahabodhi_Temple_Complex_Main.jpg",
    sections: [
      {
        id: "sec-1",
        title: "Historical Context & Overview",
        subtitle: "Introduction to the heritage site",
        layoutType: "single",
        content: "Mahabodhi Temple Complex in Bodh Gaya stands as one of ancient India's greatest UNESCO World Heritage sites, marking the sacred location where the Buddha attained Enlightenment.",
        images: [
          {
            id: "img-1",
            url: "https://www.trawell.in/blog/wp-content/uploads/2022/01/Mahabodhi_Temple_Complex_Main.jpg",
            caption: "Mahabodhi Temple Complex Main Spire, Bodh Gaya, Bihar"
          }
        ]
      }
    ]
  },
  {
    id: "photo-essay",
    title: "Photo Essay & Visual Story",
    tagline: "Media-Rich Showcase",
    badge: "High Visual Impact",
    description: "Designed for photojournalism, heritage walks, and rich visual documentation featuring image grids and staggered galleries.",
    themeColor: "from-rose-600 to-stone-900",
    iconName: "Camera",
    coverImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop",
    sections: [
      {
        id: "sec-1",
        title: "Visual Expedition Prologue",
        subtitle: "A photographic journey through sacred Bodh Gaya",
        layoutType: "fullwidth",
        content: "Capturing the timeless spiritual aura of the Mahabodhi Temple Complex under twilight shadows.",
        images: [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop",
            caption: "Mahabodhi Temple spire illuminating the night sky, Bodh Gaya"
          }
        ]
      }
    ]
  },
  {
    id: "archaeological-report",
    title: "Archaeological Research Report",
    tagline: "Academic & Field Survey",
    badge: "Field Work & Analysis",
    description: "Structured specifically for excavation summaries, artifact catalogs, trench analysis, and scientific findings.",
    themeColor: "from-emerald-600 to-slate-900",
    iconName: "Compass",
    coverImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop",
    sections: [
      {
        id: "sec-1",
        title: "Executive Summary & Trench Methodology",
        subtitle: "Excavation parameters at Kesariya Stupa",
        layoutType: "single",
        content: "Summarizing structural stratigraphy, terracotta motifs, and circular stupa terraces excavated at Kesariya.",
        images: [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop",
            caption: "Panoramic view of Kesariya Stupa excavation site"
          }
        ]
      }
    ]
  },
  {
    id: "heritage-walk",
    title: "Heritage Walk & Experience",
    tagline: "Guided Itinerary & Cultural Travel",
    badge: "Itinerary & Guide",
    description: "Perfect for walking tours, visitor itineraries, monument highlights, and experiential travel narratives.",
    themeColor: "from-blue-600 to-slate-900",
    iconName: "MapPin",
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop",
    sections: [
      {
        id: "sec-1",
        title: "Tour Introduction & Route Overview",
        subtitle: "Starting location & visitor guidelines in Patna",
        layoutType: "fullwidth",
        content: "Exploring the historic Golghar granary and architectural marvels along the banks of the River Ganges.",
        images: [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop",
            caption: "Golghar Monument and spiral stairway overlooking Patna"
          }
        ]
      }
    ]
  },
  {
    id: "conservation-spotlight",
    title: "Conservation Spotlight",
    tagline: "Restoration & Protection Chronicle",
    badge: "Restoration & Impact",
    description: "Tailored for before/after comparisons, state-backed restoration milestones, and scientific conservation updates.",
    themeColor: "from-teal-600 to-stone-900",
    iconName: "ShieldCheck",
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop",
    sections: [
      {
        id: "sec-1",
        title: "Conservation Challenge & Diagnosis",
        subtitle: "Condition assessment of Vikramshila Ruins",
        layoutType: "single",
        content: "Assessing structural preservation and brick conservation along the ancient monastic center of Vikramshila.",
        images: [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop",
            caption: "Consolidated brick stupa ruins at Vikramshila Mahavihara"
          }
        ]
      }
    ]
  }
];

export const generateUniqueId = (prefix = "sec") => {
  const randomNum = Math.floor(1 + Math.random() * 999);
  return `${prefix}-${randomNum}`;
};
