// Image Imports from existing assets
import RohtasGarhFort from "../../assets/UniqueBiharImg/RohtasFort.webp";
import NalandaUniversity from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import PatnaSahib from "../../assets/UniqueBiharImg/PatnaSahib.webp";
import VikramShila from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import VaishaliBihar from "../../assets/GalleryImg/VaishaliBihar.webp";
import KesariyaStupa from "../../assets/UniqueBiharImg/KesariyaStupa.webp";
import GolgharImg from "../../assets/heritage/GolgharImg.webp";
import BarabarCaves from "../../assets/heritage/barabar.avif";
import MadhubaniBg from "../../assets/MadhubaniBG.webp";
import BodhGaya from "../../assets/GalleryImg/BodhGaya.webp";
import JalMandir from "../../assets/GalleryImg/JalMandir.webp";
import MahabodhiTemple from "../../assets/GalleryImg/MahabodhiTemple.webp";
import KathakDancer from "../../assets/heritage/kathak_dancer.webp";
import MuseumGallery from "../../assets/heritage/museum_gallery.webp";
import AncientTemple from "../../assets/heritage/ancient_temple.webp";
import Exploration1 from "../../assets/heritage/exploration1.webp";
import Exploration2 from "../../assets/heritage/exploration2.webp";
import TelharaImg from "../../assets/heritage/telhara.webp";
import RajgirImg from "../../assets/heritage/rajgir.webp";
import ApasadhImg from "../../assets/heritage/Apasadh2.webp";
import MandarImg from "../../assets/heritage/Mandar.webp";
import PatliputraImg from "../../assets/heritage/patliputraimg.webp";
import LomasRishi from "../../assets/Gallery/lomas-rishi-cave.webp";
import LauriyaPillar from "../../assets/Gallery/lauriya-ashoka-pillar.webp";
import ChhathPuja from "../../assets/Gallery/chhath-puja.webp";
import MadhubaniArt from "../../assets/Gallery/madhubani-art.webp";
import FolkPerformance from "../../assets/Gallery/folk-performance.webp";
import TraditionalCrafts from "../../assets/Gallery/traditional-crafts.webp";
import ChhathFestival from "../../assets/HeroStrips/chhath_festival.webp";
import ManjushaArt from "../../assets/HeroStrips/manjusha_art.webp";
import DanceHeritage from "../../assets/HeroStrips/dance_heritage.webp";
import SikkiCraft from "../../assets/LivingHeritageStrip/craft.webp";
import FolkDance from "../../assets/LivingHeritageStrip/folk2.webp";

const rawBlogData = {
  featuredStory: {
    id: 1,
    title: "Reviving the Ancient Temples of Rohtasgarh",
    slug: "reviving-the-ancient-temples-of-rohtasgarh",
    category: "Conservation",
    coverImage: RohtasGarhFort,
    description: "An in-depth look at the ongoing conservation efforts preserving the architectural brilliance and cultural significance of Rohtasgarh Fort and its ancient temples perched high on the Kaimur plateau.",
    author: "Bihar Heritage Society",
    publishedAt: "July 20, 2026",
    readingTime: "6 min read"
  },

  recentStories: [
    {
      id: 2,
      title: "The Legacy of Sikki Craft: Woven with Grass",
      slug: "legacy-of-sikki-craft",
      category: "Culture",
      thumbnail: MadhubaniBg,
      publishedAt: "July 18, 2026",
      readingTime: "5 min read"
    },
    {
      id: 3,
      title: "Unveiling Forgotten Buddhist Sites of Bihar",
      slug: "forgotten-buddhist-sites",
      category: "Archaeology",
      thumbnail: KesariyaStupa,
      publishedAt: "July 15, 2026",
      readingTime: "7 min read"
    },
    {
      id: 4,
      title: "A Walk Through History: Patna's Hidden Gems",
      slug: "walking-through-patna-heritage",
      category: "Heritage Walks",
      thumbnail: PatnaSahib,
      publishedAt: "July 12, 2026",
      readingTime: "4 min read"
    },
    {
      id: 5,
      title: "Inside Vikramshila Museum: Echoes of the Past",
      slug: "inside-vikramshila-museum",
      category: "Museums",
      thumbnail: VikramShila,
      publishedAt: "July 10, 2026",
      readingTime: "6 min read"
    }
  ],

  articles: [
    {
      id: 6,
      title: "The Architectural Marvels of Bihar",
      slug: "architectural-marvels-of-bihar",
      category: "Architecture",
      coverImage: GolgharImg,
      description: "Explore the remarkable architectural heritage of Bihar, from ancient stupas to grand colonial landmarks like the massive Golghar granary that continues to define the skyline.",
      author: "BHDS Editorial",
      publishedAt: "July 8, 2026",
      readingTime: "6 min read"
    },
    {
      id: 7,
      title: "New Excavation Findings in Nalanda",
      slug: "new-excavation-findings-nalanda",
      category: "Archaeology",
      coverImage: NalandaUniversity,
      description: "Recent archaeological discoveries have revealed fascinating insights into the educational, living quarters, and cultural aspects of ancient Nalanda.",
      author: "BHDS Editorial",
      publishedAt: "July 6, 2026",
      readingTime: "7 min read"
    },
    {
      id: 8,
      title: "Folk Traditions That Define Bihar's Culture",
      slug: "folk-traditions-that-define-bihar",
      category: "Culture",
      coverImage: MadhubaniBg,
      description: "From the global acclaim of Madhubani paintings to traditional folk songs, discover the living heritage and art forms that define Bihar's cultural identity.",
      author: "BHDS Editorial",
      publishedAt: "July 3, 2026",
      readingTime: "5 min read"
    },
    {
      id: 9,
      title: "Exploring the Majestic Barabar Caves",
      slug: "exploring-barabar-caves",
      category: "Heritage Walks",
      coverImage: BarabarCaves,
      description: "Journey through India's oldest surviving rock-cut caves located in Jehanabad district, and uncover their historical, spiritual, and architectural significance.",
      author: "BHDS Editorial",
      publishedAt: "July 1, 2026",
      readingTime: "4 min read"
    },
    {
      id: 10,
      title: "The Timeless Art of Kathak in Bihar",
      slug: "timeless-art-of-kathak-bihar",
      category: "Culture",
      coverImage: KathakDancer,
      description: "A graceful legacy passed through generations—explore how Kathak continues to thrive in Bihar's cultural landscape.",
      author: "BHDS Editorial",
      publishedAt: "June 28, 2026",
      readingTime: "5 min read"
    },
    {
      id: 11,
      title: "Inside Bihar's Museums: Treasures of the Past",
      slug: "inside-bihars-museums-treasures-past",
      category: "Museums",
      coverImage: MuseumGallery,
      description: "Step inside Bihar's most significant museums and explore rare artifacts that preserve the region's glorious and diverse heritage.",
      author: "BHDS Editorial",
      publishedAt: "June 25, 2026",
      readingTime: "6 min read"
    },
    {
      id: 12,
      title: "Preserving Heritage for Future Generations",
      slug: "preserving-heritage-future-generations",
      category: "Conservation",
      coverImage: AncientTemple,
      description: "Conservation efforts across Bihar aim to protect its architectural and cultural legacy so that future generations can continue to connect with their roots.",
      author: "BHDS Editorial",
      publishedAt: "June 22, 2026",
      readingTime: "6 min read"
    },
    {
      id: 13,
      title: "Chhath Puja: The Vedic Sun Worship Festival",
      slug: "chhath-puja-vedic-festival",
      category: "Festivals",
      coverImage: PatnaSahib,
      description: "An editorial on Chhath Puja, exploring its unique ancient Vedic roots, simple rituals of sun worship, water body cleanliness, and unmatched community discipline.",
      author: "BHDS Editorial",
      publishedAt: "June 19, 2026",
      readingTime: "5 min read"
    },
    {
      id: 14,
      title: "The Legacy of Sikki Grass Craft",
      slug: "sikki-grass-craft-legacy",
      category: "Culture",
      coverImage: MadhubaniBg,
      description: "How local artisans turn wild golden grass into stunning, utility-driven and decorative handicrafts, keeping a centuries-old Mithila tradition alive in modern times.",
      author: "BHDS Editorial",
      publishedAt: "June 15, 2026",
      readingTime: "5 min read"
    },
    {
      id: 15,
      title: "Sonepur Mela: The Great Asian Heritage Fair",
      slug: "sonepur-mela-heritage-fair",
      category: "Festivals",
      coverImage: JalMandir,
      description: "A cultural exploration of the Sonepur Cattle Fair, one of Asia's largest fairs, held at the confluence of the sacred rivers Ganges and Gandak.",
      author: "BHDS Editorial",
      publishedAt: "June 10, 2026",
      readingTime: "7 min read"
    },
    {
      id: 16,
      title: "The Sacred Footsteps: Mahabodhi Temple Stupa",
      slug: "mahabodhi-temple-stupa-heritage",
      category: "Architecture",
      coverImage: MahabodhiTemple,
      description: "Analyzing the architectural evolutionary steps of the Mahabodhi Temple in Bodh Gaya, a UNESCO World Heritage site representing the pinnacle of ancient brick craftsmanship.",
      author: "BHDS Editorial",
      publishedAt: "June 05, 2026",
      readingTime: "8 min read"
    },
    {
      id: 17,
      title: "Preserving the Wall Paintings of Mithila",
      slug: "preserving-wall-paintings-mithila",
      category: "Conservation",
      coverImage: MadhubaniBg,
      description: "Understanding the challenges and breakthroughs in preserving the mud-plastered wall paintings in rural Mithilanchal, ensuring their physical survival.",
      author: "BHDS Editorial",
      publishedAt: "June 01, 2026",
      readingTime: "6 min read"
    },
    {
      id: 18,
      title: "Sujata Stupa: An Archeological Treasure",
      slug: "sujata-stupa-archeological-treasure",
      category: "Archaeology",
      coverImage: BodhGaya,
      description: "Uncovering the history of the Sujata Garh Stupa in Bakraur, built to honor the milkmaid Sujata who fed Gautama Buddha rice pudding before his enlightenment.",
      author: "BHDS Editorial",
      publishedAt: "May 28, 2026",
      readingTime: "5 min read"
    },
    {
      id: 19,
      title: "Bodh Gaya Heritage Walk: A Spiritual Trail",
      slug: "bodh-gaya-spiritual-trail",
      category: "Heritage Walks",
      coverImage: BodhGaya,
      description: "A complete walking guide to the monasteries, meditation gardens, and lesser-known historical sites surrounding the great Mahabodhi complex.",
      author: "BHDS Editorial",
      publishedAt: "May 25, 2026",
      readingTime: "5 min read"
    },
    {
      id: 20,
      title: "The Exquisite Stone Art of Patliputra",
      slug: "exquisite-stone-art-patliputra",
      category: "Museums",
      coverImage: VikramShila,
      description: "A look at the Mauryan polished stone art, pillars, and sculptures preserved within our regional museums, reflecting unparalleled ancient craftsmanship.",
      author: "BHDS Editorial",
      publishedAt: "May 20, 2026",
      readingTime: "6 min read"
    },
    {
      id: 21,
      title: "Sher Shah Suri Mausoleum: Indo-Islamic Genius",
      slug: "sher-shah-suri-mausoleum",
      category: "Architecture",
      coverImage: KesariyaStupa,
      description: "Explore the octagonal tomb of Sher Shah Suri in Sasaram, an architectural masterpiece standing in the middle of an artificial lake, blending Indo-Islamic designs.",
      author: "BHDS Editorial",
      publishedAt: "May 15, 2026",
      readingTime: "7 min read"
    },
    {
      id: 22,
      title: "Ancient Rock Paintings of Kaimur Hills",
      slug: "ancient-rock-paintings-kaimur",
      category: "Archaeology",
      coverImage: RohtasGarhFort,
      description: "Reviewing the discovery of prehistoric rock carvings and paintings in the shelter caves of Kaimur, mapping Bihar's earliest human habitations.",
      author: "BHDS Editorial",
      publishedAt: "May 10, 2026",
      readingTime: "6 min read"
    },
    {
      id: 23,
      title: "The Ancient Fortifications of Rajgir",
      slug: "ancient-fortifications-rajgir",
      category: "Conservation",
      coverImage: BodhGaya,
      description: "Ongoing initiatives to document and safeguard the Cyclopean Wall of Rajgir, a massive 40-km long stone fortification built before the Mauryan Era.",
      author: "BHDS Editorial",
      publishedAt: "May 05, 2026",
      readingTime: "8 min read"
    },
    {
      id: 24,
      title: "Dev Deepawali in Pawapuri: Festival of Lights",
      slug: "dev-deepawali-pawapuri",
      category: "Festivals",
      coverImage: JalMandir,
      description: "Experiencing the glorious spiritual environment and lakeside lamp lighting ceremonies at Jal Mandir during Kartik Purnima.",
      author: "BHDS Editorial",
      publishedAt: "May 01, 2026",
      readingTime: "5 min read"
    },
    {
      id: 25,
      title: "Rajgir Heritage Walk: Hills and Springs",
      slug: "rajgir-heritage-walk-hills",
      category: "Heritage Walks",
      coverImage: BodhGaya,
      description: "A cultural walk through the Gridhakuta (Vulture Peak), hot springs, and historic caves that served as key sites for early Buddhist and Jain congregations.",
      author: "BHDS Editorial",
      publishedAt: "April 25, 2026",
      readingTime: "6 min read"
    }
  ],

  filters: [
    "All",
    "Architecture",
    "Archaeology",
    "Culture",
    "Conservation",
    "Museums",
    "Festivals",
    "Heritage Walks"
  ]
};




// In-article photos by category, so sections don't repeat the banner image
const CATEGORY_IMAGES = {
  Architecture: [MahabodhiTemple, GolgharImg, PatnaSahib, AncientTemple, RohtasGarhFort, JalMandir],
  Archaeology: [Exploration1, Exploration2, TelharaImg, NalandaUniversity, ApasadhImg, LauriyaPillar, PatliputraImg],
  Culture: [MadhubaniArt, SikkiCraft, FolkPerformance, KathakDancer, ManjushaArt, TraditionalCrafts, DanceHeritage],
  Conservation: [Exploration2, AncientTemple, VikramShila, Exploration1, BarabarCaves, MadhubaniArt],
  Museums: [MuseumGallery, PatliputraImg, AncientTemple, VikramShila, NalandaUniversity],
  Festivals: [ChhathPuja, ChhathFestival, FolkDance, DanceHeritage, FolkPerformance],
  "Heritage Walks": [GolgharImg, RajgirImg, LomasRishi, BodhGaya, MandarImg, PatnaSahib, BarabarCaves],
};
const GENERAL_IMAGES = [NalandaUniversity, KesariyaStupa, VaishaliBihar, MahabodhiTemple, RajgirImg, Exploration1, MuseumGallery];

const pickSectionImages = (article, count = 2) => {
  const cover = article.coverImage || article.thumbnail;
  const pool = [...new Set([...(CATEGORY_IMAGES[article.category] || []), ...GENERAL_IMAGES])].filter(
    (img) => img && img !== cover
  );
  const start = (Number(article.id) || 0) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
};

const generateContent = (article) => {
  const { title, category, coverImage, thumbnail, description, publishedAt, readingTime } = article;
  const mainImage = coverImage || thumbnail;
  const [sectionImageA, sectionImageB] = pickSectionImages(article);

  return [
    {
      type: "hero",
      image: mainImage,
      title,
      description: `${description} Over the years, this site has stood as a silent witness to Bihar's rich cultural, spiritual, and artistic evolution.`,
      meta: { category, date: publishedAt, readingTime },
    },
    {
      type: "imageLeft",
      image: sectionImageA,
      title: "A Living Record",
      paragraphs: [
        "Archaeological investigations and scientific surveys have consistently shed light on the architectural brilliance of the site. Teams of historians and curators work round the clock to document each facet of its survival.",
        "These reports help bridge the gap between ancient chronicles and the physical remains that stand today.",
      ],
    },
    {
      type: "quote",
      text: `The structural and artistic heritage of ${title} is a testament to the intellectual heights and skilled craftsmanship of ancient Bihar.`,
      author: article.author || "Bihar Heritage Society",
    },
    {
      type: "imageRight",
      image: sectionImageB,
      title: "Conservation in Practice",
      paragraphs: [
        "Under the patronage of the Bihar Heritage Development Society, conservationists employ traditional, local materials and techniques to preserve the original stone and mortar work.",
        "This ensures the aesthetic and material integrity of the structure is passed down without compromise.",
      ],
    },
    {
      type: "text",
      heading: "Ongoing Stewardship",
      paragraphs: [
        "Preservation here is not a single act but a **continuing commitment**, renewed each season by conservators, local custodians, and the communities who live alongside these monuments.",
      ],
      list: {
        type: "ul",
        items: [
          "Use of organic conservation materials matching original chemical compositions.",
          "Systematic digital documentation of historical inscriptions.",
          "Stewardship programs involving local communities as heritage custodians.",
        ],
      },
    },
  ];
};

export const blogData = {
  ...rawBlogData,
  featuredStory: {
    ...rawBlogData.featuredStory,
    blocks: generateContent(rawBlogData.featuredStory),
    content: generateContent(rawBlogData.featuredStory),
  },
  recentStories: rawBlogData.recentStories.map((s) => ({
    ...s,
    blocks: generateContent(s),
    content: generateContent(s),
  })),
  articles: rawBlogData.articles.map((a) => ({
    ...a,
    blocks: generateContent(a),
    content: generateContent(a),
  })),
};

export const allDemoArticles = [
  blogData.featuredStory,
  ...blogData.recentStories,
  ...blogData.articles,
];
