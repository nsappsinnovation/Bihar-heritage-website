/**
 * Default CMS Data — consolidated default datasets for every module.
 * These are used to initialize localStorage on first load.
 * 
 * NOTE: Pages that import asset files (images, PDFs) directly cannot
 * have their data fully serialized. For those modules, the default data
 * is kept inline in the page component and passed to getData() at runtime.
 */

export { default as defaultProtectedSites } from "./defaultProtectedSites.json";
export { defaultExcavations } from "./defaultExcavations";
export { defaultWorkshops } from "./defaultWorkshops";
export { defaultEvents } from "./defaultEvents";
export { defaultPublications } from "./defaultPublications";

export { defaultNews } from "./defaultNews";

export { defaultVideos } from "./defaultVideos";

// ─── Blogs ──────────────────────────────────────────────
export const defaultBlogs = [
  { id: 6, title: "The Architectural Marvels of Bihar", slug: "architectural-marvels-of-bihar", category: "Architecture", description: "Explore the remarkable architectural heritage of Bihar.", author: "BHDS Editorial", publishedAt: "July 8, 2026", readingTime: "6 min read", featured: false, status: "Published" },
  { id: 7, title: "New Excavation Findings in Nalanda", slug: "new-excavation-findings-nalanda", category: "Archaeology", description: "Recent archaeological discoveries have revealed fascinating insights into the educational legacy of Nalanda Mahavihara.", author: "BHDS Editorial", publishedAt: "July 6, 2026", readingTime: "7 min read", featured: false, status: "Published" },
  { id: 8, title: "Folk Traditions That Define Bihar's Culture", slug: "folk-traditions-that-define-bihar", category: "Culture", description: "From the global acclaim of Madhubani paintings to traditional folk songs, discover the living heritage.", author: "BHDS Editorial", publishedAt: "July 3, 2026", readingTime: "5 min read", featured: false, status: "Published" },
  { id: 9, title: "Exploring the Majestic Barabar Caves", slug: "exploring-barabar-caves", category: "Heritage Walks", description: "Journey through India's oldest surviving rock-cut caves.", author: "BHDS Editorial", publishedAt: "July 1, 2026", readingTime: "4 min read", featured: false, status: "Published" },
  { id: 10, title: "Conserving Bihar's Historic Stepwells", slug: "conserving-historic-stepwells", category: "Conservation", description: "Learn about state-backed restoration initiatives.", author: "BHDS Editorial", publishedAt: "June 28, 2026", readingTime: "5 min read", featured: false, status: "Published" },
];

export { defaultPhotos } from "./defaultPhotos";
export {
  defaultGoverningBody,
  defaultExecutiveCommittee,
  defaultKeyFunctionaries,
  defaultArcheologicalTeam,
  defaultOrganization,
} from "./defaultOrganization";
export {
  defaultHeritageArchives,
  defaultPopularSites,
  defaultLivingHeritageVideos,
} from "./defaultShowcase";

