import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutList,
  Grid,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Compass,
  BookOpen
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

// Image Imports
import BodhGaya from "../../assets/UniqueBiharImg/BodhGaya.webp";
import NalandaUniversity from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import Rajgir from "../../assets/UniqueBiharImg/rajgir.webp";
import MahabodhiTemple from "../../assets/UniqueBiharImg/MahabodhiTemple.webp";
import RohtasFort from "../../assets/UniqueBiharImg/RohtasFort.webp";
import ChaatPuja from "../../assets/UniqueBiharImg/ChaatPuja.webp";
import MadhubaniArt from "../../assets/UniqueBiharImg/MadhubaniArt.webp";
import PatnaSahib from "../../assets/UniqueBiharImg/PatnaSahib.webp";
import KesariyaStupa from "../../assets/UniqueBiharImg/KesariyaStupa.webp";
import VikramshilaUniversity from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";

// Additional Gallery Imports
import JalMandir from "../../assets/GalleryImg/JalMandir.webp";
import VaishaliBihar from "../../assets/GalleryImg/VaishaliBihar.webp";

const categories = [
  { id: "all", label: "All Legacies" },
  { id: "history", label: "Ancient History & Wisdom", icon: BookOpen },
  { id: "heritage", label: "Sacred Monuments", icon: Compass },
  { id: "culture", label: "Culture & Traditions", icon: Calendar },
];

const features = [
  // --- HISTORY & ANCIENT WISDOM ---
  {
    id: "nalanda",
    category: "history",
    title: "Nalanda University",
    description: "World’s First Residential University",
    subtitle: "Famed seat of ancient learning attracting scholars worldwide.",
    icon: NalandaUniversity,
    url: "https://en.wikipedia.org/wiki/Nalanda",
    details: "Founded in the 5th century CE, Nalanda was the ancient world's premier residential university. It housed over 10,000 students and 2,000 teachers from across Asia, including China, Korea, Tibet, and Central Asia. Its legendary library, Dharmaganja, held millions of manuscripts on philosophy, mathematics, astronomy, and medicine. It stands as a testament to India's intellectual supremacy in antiquity.",
    facts: [
      { label: "Established", value: "5th Century CE" },
      { label: "Location", value: "Nalanda District" },
      { label: "Key Scholar", value: "Aryabhata, Xuanzang" },
      { label: "Heritage Status", value: "UNESCO World Heritage Site" }
    ]
  },
  {
    id: "vikramshila",
    category: "history",
    title: "Vikramshila University",
    description: "Ancient center of Buddhist learning",
    subtitle: "Renowned monastic university for Vajrayana Buddhism.",
    icon: VikramshilaUniversity,
    url: "https://en.wikipedia.org/wiki/Vikramashila",
    details: "Established by King Dharmapala of the Pala Dynasty in the late 8th century, Vikramshila was one of the two most important centers of learning in India during the Pala Empire, alongside Nalanda. It specialized in Vajrayana Buddhism, philosophy, grammar, and metaphysics. Scholars from Vikramshila traveled to Tibet to propagate Buddhism and translate scriptures.",
    facts: [
      { label: "Founder", value: "King Dharmapala (Pala Dynasty)" },
      { label: "Established", value: "Late 8th Century CE" },
      { label: "Location", value: "Bhagalpur District" },
      { label: "Specialization", value: "Vajrayana Buddhism" }
    ]
  },
  {
    id: "vaishali",
    category: "history",
    title: "Vaishali Republic",
    description: "Birthplace of democracy & Mahavira",
    subtitle: "The world's first republic and birthplace of Lord Mahavira.",
    icon: VaishaliBihar,
    url: "https://en.wikipedia.org/wiki/Vaishali_(ancient_city)",
    details: "Vaishali is renowned as the world's first democratic republic, established in the 6th century BCE by the Licchavis. It is also the birthplace of Lord Mahavira, the 24th Jain Tirthankara, and is where Lord Buddha preached his last sermon and announced his approaching Mahaparinirvana.",
    facts: [
      { label: "Historical Epoch", value: "6th Century BCE" },
      { label: "Significance", value: "World's First Republic" },
      { label: "Birthplace", value: "Lord Mahavira" },
      { label: "Location", value: "Vaishali District" }
    ]
  },
  {
    id: "patliputra",
    category: "history",
    title: "Patliputra Imperial Capital",
    description: "Seat of Maurya & Gupta Empires",
    subtitle: "The grand imperial capital of ancient India's greatest dynasties.",
    icon: "/images/remote/xyz-62-88d29771.webp",
    url: "https://en.wikipedia.org/wiki/Pataliputra",
    details: "Modern-day Patna, Patliputra was the seat of power for legendary rulers like Chandragupta Maurya, Ashoka the Great, and Chandragupta Vikramaditya. Described by Greek ambassador Megasthenes as one of the world's largest cities in its prime, it was the nerve center of administration, trade, and science for centuries.",
    facts: [
      { label: "Founded By", value: "King Udayin (Haryanka Dynasty)" },
      { label: "Dynasties", value: "Maurya, Gupta, Shunga" },
      { label: "Mentioned By", value: "Megasthenes (Indica)" },
      { label: "Current City", value: "Patna" }
    ]
  },
  {
    id: "barabar",
    category: "history",
    title: "Barabar Caves",
    description: "Oldest rock-cut caves in India",
    subtitle: "Miraculous rock-cut caves dating back to the Maurya Empire.",
    icon: "/images/remote/m-barabar-caves-3-l-400-600-5012fd22.webp",
    url: "https://en.wikipedia.org/wiki/Barabar_Caves",
    details: "Located in the Jehanabad district, these caves date back to the Mauryan Empire (3rd century BCE). Famous for their high-gloss mirror-like interior polish and precision rock-cutting, they were built for the Ajivika sect and represent the beginning of Indian rock-cut architecture. The caves feature inscriptions by Emperor Ashoka himself.",
    facts: [
      { label: "Established", value: "3rd Century BCE" },
      { label: "Built By", value: "Emperor Ashoka" },
      { label: "Location", value: "Jehanabad District" },
      { label: "Architecture", value: "Ajivika Rock-Cut" }
    ]
  },
  {
    id: "chirand",
    category: "history",
    title: "Chirand Neolithic Site",
    description: "Ancient Stone Age Settlement",
    subtitle: "One of India's earliest neolithic sites, dating back to 2500 BCE.",
    icon: "/images/remote/chirand44-2025-12-56508bf18114c15a79bad3-ba47c939.webp",
    url: "https://en.wikipedia.org/wiki/Chirand",
    details: "Located in Saran district on the banks of the Ganga, Chirand is Bihar's first known neolithic site. Excavations revealed bone tools made of deer antlers, clay pottery, stone tools, and carbonized grains representing early agricultural settlement dating back to 2500–1000 BCE.",
    facts: [
      { label: "Established", value: "2500 BCE (Late Neolithic)" },
      { label: "Location", value: "Saran (Chapra) District" },
      { label: "Key Findings", value: "Bone tools, Ochre Colored Pottery" },
      { label: "Era", value: "Stone and Bronze Age transition" }
    ]
  },
  {
    id: "champapuri",
    category: "history",
    title: "Champapuri (Ancient Champa)",
    description: "Capital of Anga Mahajanapada",
    subtitle: "Famed ancient trading port and spiritual capital of Anga.",
    icon: "/images/remote/images-d7b1caf1.webp",
    url: "https://en.wikipedia.org/wiki/Champa_(city)",
    details: "Champapuri (modern Bhagalpur) was the capital of the Anga Mahajanapada, ruled by Karna in the Mahabharata. It was a massive trade hub on the Ganga, serving as a gateway to East Asia. It is also highly sacred in Jainism as the birthplace of Vasupujya, the 12th Tirthankara.",
    facts: [
      { label: "Mahajanapada", value: "Anga Kingdom" },
      { label: "Historical Epoch", value: "6th Century BCE" },
      { label: "Location", value: "Bhagalpur District" },
      { label: "Jain Significance", value: "Birthplace of Vasupujya Tirthankara" }
    ]
  },
  {
    id: "cyclopean_wall",
    category: "history",
    title: "Cyclopean Wall of Rajgir",
    description: "Pre-Mauryan Defense Marvel",
    subtitle: "40-kilometer ancient stone wall, one of India's oldest masonry works.",
    icon: "/images/remote/images-93c26e9c.webp",
    url: "https://en.wikipedia.org/wiki/Cyclopean_Wall_of_Rajgir",
    details: "The Cyclopean Wall is a 40 km long massive stone fortification built during the Brihadratha dynasty (before the 6th century BCE) to protect the ancient city of Rajgriha from external invaders. Constructed using raw, massive undressed stones without any mortar, it represents one of India's oldest surviving defense engineering works.",
    facts: [
      { label: "Period", value: "Pre-Mauryan (c. 1000 BCE)" },
      { label: "Wall Length", value: "40 Kilometers (approx.)" },
      { label: "Material", value: "Raw undressed block stones" },
      { label: "Engineering Type", value: "Cyclopean Masonry" }
    ]
  },

  // --- SACRED HERITAGE SITES ---
  {
    id: "bodhgaya",
    category: "heritage",
    title: "Bodh Gaya & Mahabodhi",
    description: "Cradle of Buddha's Enlightenment",
    subtitle: "The holiest Buddhist pilgrimage site under the sacred Bodhi tree.",
    icon: BodhGaya,
    url: "https://en.wikipedia.org/wiki/Bodh_Gaya",
    details: "This grand brick temple, built near the Bodhi Tree under which Siddhartha Gautama attained enlightenment in 531 BCE, is the ultimate pilgrimage site for Buddhists worldwide. The Mahabodhi Temple complex is a masterpiece of late Gupta-era brick architecture and features the sacred Bodhi Tree, the Vajrasana (diamond throne), and the pristine lotus pond.",
    facts: [
      { label: "Historic Event", value: "Enlightenment of Siddhartha Gautama" },
      { label: "Primary Shrine", value: "Mahabodhi Temple" },
      { label: "Location", value: "Gaya District" },
      { label: "Heritage Status", value: "UNESCO World Heritage Site" }
    ]
  },
  {
    id: "rajgir",
    category: "heritage",
    title: "Rajgir & Shanti Stupa",
    description: "Valley of Spiritual Harmony",
    subtitle: "Ancient capital of Magadha, sacred to Buddhism and Jainism.",
    icon: Rajgir,
    url: "https://en.wikipedia.org/wiki/Rajgir",
    details: "Nestled among five green hills, Rajgir was the capital of the Magadha Empire before Patliputra. Key attractions include Gridhakuta (Vulture's Peak) where Buddha preached his Lotus Sutra, the ancient Cyclopean Wall (a 40km pre-Mauryan stone wall), and the majestic white-marble Vishwa Shanti Stupa (Peace Pagoda) built by Japanese Buddhists.",
    facts: [
      { label: "Significance", value: "Sacred to Buddhists & Jains" },
      { label: "Key Landmarks", value: "Vishwa Shanti Stupa, Gridhakuta" },
      { label: "Unique Feature", value: "Hot Sulphur Springs" },
      { label: "Location", value: "Nalanda District" }
    ]
  },
  {
    id: "patnasahib",
    category: "heritage",
    title: "Takht Sri Patna Sahib",
    description: "Birthplace of Guru Gobind Singh Ji",
    subtitle: "One of the five highest temporal seats of Sikh authority.",
    icon: PatnaSahib,
    url: "https://en.wikipedia.org/wiki/Takht_Sri_Patna_Sahib",
    details: "Built in remembrance of Guru Gobind Singh Ji, the tenth Guru of the Sikhs, who was born here in 1666. It is one of the five Takhts (seats of temporal authority) in Sikhism, housing holy relics and visited by millions of devotees. Maharaja Ranjit Singh built the initial structure of the Gurudwara in the 19th century.",
    facts: [
      { label: "Guru Born", value: "Guru Gobind Singh Ji (1666)" },
      { label: "Sikh Status", value: "One of the Five Holy Takhts" },
      { label: "Location", value: "Patna City" },
      { label: "Patron Developer", value: "Maharaja Ranjit Singh" }
    ]
  },
  {
    id: "jalmandir",
    category: "heritage",
    title: "Jal Mandir (Pawapuri)",
    description: "Nirvana of Lord Mahavira",
    subtitle: "A stunning marble temple floating in a lotus-filled lake.",
    icon: JalMandir,
    url: "https://en.wikipedia.org/wiki/Pawapuri",
    details: "Pawapuri is the holy site where Lord Mahavira, the 24th and last Tirthankara of Jainism, attained Moksha (liberation/nirvana) in 527 BCE. The Jal Mandir is a pristine white-marble temple built in the center of a water tank filled with pink lotuses, accessible via a long stone bridge. It is a highly sacred destination for Jain pilgrims.",
    facts: [
      { label: "Sacred Event", value: "Nirvana of Lord Mahavira" },
      { label: "Key Feature", value: "Floating marble structure in Lotus Pond" },
      { label: "Location", value: "Nalanda District" },
      { label: "Established", value: "Ancient, renovated over centuries" }
    ]
  },
  {
    id: "rohtasfort",
    category: "heritage",
    title: "Rohtasgarh Fort",
    description: "Impregnable Medieval Citadel",
    subtitle: "Majestic hill fort showcasing grand defense architecture.",
    icon: RohtasFort,
    url: "https://en.wikipedia.org/wiki/Rohtasgarh_Fort",
    details: "Perched on the Kaimur hills at an altitude of 1500 feet, Rohtasgarh Fort is one of the most ancient and impregnable hill forts in India, later rebuilt and fortified by Sher Shah Suri. It features palaces, temples, gates, and mosques overlooking the Sone Valley. It was a strategic stronghold for rulers of northern India.",
    facts: [
      { label: "Location", value: "Rohtas District" },
      { label: "Altitude", value: "1,500 feet above sea level" },
      { label: "Renovator", value: "Sher Shah Suri" },
      { label: "Key Palaces", value: "Man Singh Palace, Phool Mahal" }
    ]
  },
  {
    id: "kesariya",
    category: "heritage",
    title: "Kesariya Stupa",
    description: "World's Tallest Buddhist Stupa",
    subtitle: "Massive ancient monument holding deep spiritual legacy.",
    icon: KesariyaStupa,
    url: "https://en.wikipedia.org/wiki/Kesaria_stupa",
    details: "Rising 104 feet, Kesariya Stupa is the largest and tallest ancient Buddhist stupa in the world, dating back to between the 2nd and 6th centuries CE. It is believed that Buddha stayed here before his Mahaparinirvana, leaving behind his begging bowl with the Licchavis. It was excavated in 1998 by the Archaeological Survey of India.",
    facts: [
      { label: "Height", value: "104 feet (32 meters)" },
      { label: "Dating", value: "Gupta / Pala Period" },
      { label: "Location", value: "East Champaran District" },
      { label: "Excavation Year", value: "1998" }
    ]
  },
  {
    id: "shershah_tomb",
    category: "heritage",
    title: "Sher Shah Suri Tomb",
    description: "Indo-Islamic Architectural Marvel",
    subtitle: "Red sandstone tomb standing beautifully in a lake at Sasaram.",
    icon: "/images/remote/images-84a2a6eb.webp",
    url: "https://en.wikipedia.org/wiki/Tomb_of_Sher_Shah_Suri",
    details: "Built in Sasaram between 1540 and 1545, this majestic mausoleum is dedicated to Sher Shah Suri, the founder of the Suri Empire. Constructed of red sandstone, the octagonal tomb is situated in the middle of a square artificial lake. It is considered one of the finest examples of Indo-Islamic architecture, often described as the 'Second Taj Mahal' due to its scale and proportions.",
    facts: [
      { label: "Dedicated To", value: "Sher Shah Suri (Sur Empire)" },
      { label: "Architect", value: "Aliwal Khan" },
      { label: "Built Period", value: "1540–1545 CE" },
      { label: "Style", value: "Indo-Islamic Octagonal Tomb" }
    ]
  },
  {
    id: "mandar_hill",
    category: "heritage",
    title: "Mandar Hill (Mandar Parvat)",
    description: "Sacred Hill of Amrit Churning",
    subtitle: "Historic granite hill linked to Hindu and Jain spiritual legacies.",
    icon: "/images/remote/caption-91b7cd5f.webp",
    url: "https://en.wikipedia.org/wiki/Mandar_Hill",
    details: "Mandatory place of pilgrimage in Banka, Mandar Hill is a 700-foot granite hill mentioned in Hindu scriptures as Mount Mandara, which was used as the churning rod during Samudra Manthan (churning of the ocean). It features ancient rock-cut inscriptions, shell scripts, and temples sacred to both Hinduism and Jainism.",
    facts: [
      { label: "Mythological Name", value: "Mount Mandara" },
      { label: "Religious Significance", value: "Hinduism & Jainism" },
      { label: "Height", value: "700 feet granite monolith" },
      { label: "Location", value: "Banka District" }
    ]
  },
  {
    id: "deo_temple",
    category: "heritage",
    title: "Deo Surya Mandir",
    description: "West-Facing Stone Temple",
    subtitle: "Unique 15th-century stone temple dedicated to the Sun God in Aurangabad.",
    icon: "/images/remote/msid-52430772-width-96-height-65-cec9963c.webp",
    url: "https://en.wikipedia.org/wiki/Deo_Surya_Mandir",
    details: "The Deo Surya Mandir in Aurangabad is a unique 15th-century stone temple built by the Bundela Rajas. Unlike most Sun temples that face east, this temple faces west. The architecture is a blend of Nagar and Dravidian styles, constructed without mortar using interlocking stones. It is the hub of Chhath celebrations.",
    facts: [
      { label: "Dedicated To", value: "Sun God (Surya)" },
      { label: "Orientation", value: "West-facing (Unique)" },
      { label: "Location", value: "Aurangabad District" },
      { label: "Style", value: "Interlocking Stone Architecture" }
    ]
  },

  // --- CULTURE, ART & TRADITIONS ---
  {
    id: "chhath",
    category: "culture",
    title: "Chhath Puja",
    description: "Vedic Sun Worship Festival",
    subtitle: "Ancient festival honoring the Sun God with ritualistic traditions.",
    icon: ChaatPuja,
    url: "https://en.wikipedia.org/wiki/Chhath",
    details: "Chhath is Bihar's most significant cultural festival, dedicated to the Sun God Surya and Chhathi Maiya (Usha). Characterized by strict fasting, standing in holy rivers, and offering Arghya at sunset and sunrise, it is celebrated without any priests or idols, emphasizing purity, nature, and equality.",
    facts: [
      { label: "Deity Honored", value: "Surya (Sun God) & Chhathi Maiya" },
      { label: "Core Values", value: "Purity, Environment, Inclusivity" },
      { label: "Duration", value: "4 Days of Rigorous Fasting" },
      { label: "Season", value: "Kartik (Oct/Nov) & Chaitra (Mar/Apr)" }
    ]
  },
  {
    id: "madhubani",
    category: "culture",
    title: "Madhubani Painting",
    description: "Mithila's Timeless Folk Art",
    subtitle: "Traditional painting style with colorful themes and patterns.",
    icon: MadhubaniArt,
    url: "https://en.wikipedia.org/wiki/Madhubani_art",
    details: "Originating in the Mithila region, Madhubani Art is a world-renowned style of painting done with fingers, twigs, brushes, nib-pens, and matchsticks using natural dyes and pigments. It depicts mythological themes, nature, and royal courts. The art form was traditionally created on freshly plastered mud walls of huts.",
    facts: [
      { label: "Origin Region", value: "Mithila (Madhubani, Darbhanga)" },
      { label: "Medium", value: "Natural Dyes, Rice Paste, Twigs" },
      { label: "Themes", value: "Deities, Nature, Social Events" },
      { label: "GI Status", value: "Geographical Indication (GI) Protected" }
    ]
  },
  {
    id: "sonepur",
    category: "culture",
    title: "Sonepur Cattle Fair",
    description: "Asia's Grand Cultural Congregation",
    subtitle: "One of Asia's largest traditional cattle and cultural fairs.",
    icon: "/images/remote/sonepur-cattle-fair-00-f36023f8.webp",
    url: "https://en.wikipedia.org/wiki/Sonepur_Cattle_Fair",
    details: "Held on Kartik Poornima at the confluence of the Ganga and Gandak rivers in Sonepur, this ancient fair traces its roots back to the Mauryan Empire. It is famous for cattle trade, elephant exhibitions, cultural performances, and traditional handicrafts.",
    facts: [
      { label: "Event Date", value: "Kartik Poornima (Nov/Dec)" },
      { label: "Location", value: "Sonepur (Confluence of Ganga & Gandak)" },
      { label: "Historic Roots", value: "Chandragupta Maurya Era" },
      { label: "Main Attractions", value: "Elephant Show, Cattle Trading, Folk Theatre" }
    ]
  },
  {
    id: "manjusha",
    category: "culture",
    title: "Sujini & Manjusha Art",
    description: "Folk Crafts & Scroll Paintings",
    subtitle: "Unique GI-tagged textile art and story-scrolls of Anga.",
    icon: "/images/remote/photo-1582201942988-13e60e4556ee-edce3820.webp",
    url: "https://en.wikipedia.org/wiki/Manjusha_Art",
    details: "Sujini Embroidery is a traditional quilting technique from Mithila depicting narratives of women's lives and social issues. Manjusha Art, originating from the Anga region (Bhagalpur), is a folk art style painted on boxes of jute and paper, based on the folklore of Bihula-Bishahari, utilizing three colors: red, yellow, and green.",
    facts: [
      { label: "Sujini Origin", value: "Mithila Quilting Craft" },
      { label: "Manjusha Origin", value: "Anga Region (Bhagalpur)" },
      { label: "Manjusha Colors", value: "Red, Yellow, Green exclusively" },
      { label: "Themes", value: "Snake Goddess, Folk Tales of Bihula" }
    ]
  },
  {
    id: "cuisine",
    category: "culture",
    title: "Bihari Cuisine (Litti Chokha)",
    description: "Flavors of the Earth",
    subtitle: "Delectable, traditional cuisine highlighting roasted sattu.",
    icon: "/images/remote/2-ad7102fc.webp",
    url: "https://en.wikipedia.org/wiki/Bihari_cuisine",
    details: "Bihar's cuisine is highly nutritious and earth-friendly. The signature dish, Litti Chokha, consists of wheat balls stuffed with spiced roasted chickpea flour (Sattu) grilled over cow dung cakes, served with mashed eggplant, potatoes, and tomatoes (Chokha) along with ghee. Other delicacies include Makhana, Khaja, and Tilkut.",
    facts: [
      { label: "Signature Dish", value: "Litti Chokha" },
      { label: "Superfood Component", value: "Sattu (Roasted Gram Flour)" },
      { label: "Traditional Sweets", value: "Khaja, Thekua, Tilkut" },
      { label: "Cooking Method", value: "Earthen Ovens / Charcoal Grilling" }
    ]
  },
  {
    id: "dances",
    category: "culture",
    title: "Folk Dances (Jat-Jatin & Jhijhiya)",
    description: "Rhythms of Bihar's Soil",
    subtitle: "Expressive theatrical dances depicting folklore and life.",
    icon: "/images/remote/women-performing-jhijhiya-dance-296b264c.webp",
    url: "https://en.wikipedia.org/wiki/Music_of_Bihar",
    details: "Bihar has a vibrant tradition of folk performing arts. Jat-Jatin is performed by women during monsoons to portray husband-wife relations, domestic stories, and social issues. Jhijhiya is a ritualistic dance where women balance clay lanterns with holes on their heads, dancing to pray for rain and ward off evil spirits.",
    facts: [
      { label: "Jat-Jatin Theme", value: "Love, Separation, Social satire" },
      { label: "Jhijhiya Prop", value: "Perforated clay pot with oil lamp" },
      { label: "Performing Group", value: "Exclusively local women communities" },
      { label: "Festive Season", value: "Monsoon (Bhadrapad) / Navratri" }
    ]
  },
  {
    id: "sama_chakeva",
    category: "culture",
    title: "Sama-Chakeva Festival",
    description: "Sibling Bond & Nature Celebration",
    subtitle: "Mithila folk festival welcoming migratory birds with clay icons.",
    icon: "/images/remote/images-49b0a3a8.webp",
    url: "https://en.wikipedia.org/wiki/Sama_Chakeva",
    details: "Sama-Chakeva is a beautiful folk festival celebrated in the Mithila region during November. It celebrates the loving bond between brother and sister, where girls craft clay figurines of birds (Sama, Chakeva) and characters from local legends. The festival also welcomes migratory birds that arrive from the Himalayas.",
    facts: [
      { label: "Origin Region", value: "Mithila (Northern Bihar)" },
      { label: "Meaning", value: "Sibling love and welcoming migratory birds" },
      { label: "Props", value: "Handmade painted clay bird figurines" },
      { label: "Timing", value: "10-day celebration in Kartik month" }
    ]
  },
  {
    id: "bihula_gatha",
    category: "culture",
    title: "Bihula-Bishahari Folk Legend",
    description: "Anga's Legend of Devotion",
    subtitle: "Saga of Bihula's triumph over fate, celebrated in local art.",
    icon: "/images/remote/17-08-2022-bishari-puja-2022-22986070-11-ce03adfd.webp",
    url: "https://en.wikipedia.org/wiki/Manjusha_Art",
    details: "The legend of Bihula-Bishahari is a celebrated folk saga of East Bihar (Anga region). It narrates the story of Bihula, a devoted bride who battles fate and the Serpent Goddess Manasa (Bishahari) to restore her husband's life. This legend is the root of the three-colored Manjusha Art and is sung during Shravan as a powerful ballad.",
    facts: [
      { label: "Region", value: "Bhagalpur (Anga)" },
      { label: "Core Theme", value: "Feminine grit, snake deities" },
      { label: "Associated Art", value: "Manjusha Paintings" },
      { label: "Ritual Period", value: "August (Shravan month)" }
    ]
  },
  {
    id: "bhagalpur_silk",
    category: "culture",
    title: "Bhagalpuri Silk (Tussar Silk)",
    description: "Queen of Wild Silks",
    subtitle: "Centuries-old organic silk weaving legacy of Bhagalpur.",
    icon: "/images/remote/photo-81057361.webp",
    url: "https://en.wikipedia.org/wiki/Bhagalpur_silk",
    details: "Bhagalpur is globally known as the 'Silk City' of India for its exquisite Tussar Silk (wild silk). The craft is centuries old, passed down through generations of weavers. Bhagalpuri silk is distinguished by its unique texture, organic sheen, and eco-friendly dye processes. It holds a coveted Geographical Indication (GI) status.",
    facts: [
      { label: "Known As", value: "Silk City of India" },
      { label: "Material Type", value: "Tussar Silk (Wild Organic Silk)" },
      { label: "Weaving Heritage", value: "Century-old family looms" },
      { label: "GI Status", value: "Geographical Indication Protected" }
    ]
  }
];

const UniqueBihar = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("carousel"); // 'carousel' or 'grid'
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter features based on search query and category
  const filteredFeatures = features.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation variants for card container staggering
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-brand-dark">
      {/* Main Exploration Section - Reduced top and bottom gap */}
      <section className="relative pt-16 pb-12 px-6 md:px-12 lg:px-20 bg-brand-dark border-t border-brand-border/60">
        
        {/* Editorial Decorative Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0), linear-gradient(to right, var(--color-brand-border) 1px, transparent 1px)`,
            backgroundSize: `40px 40px, 120px 120px`
          }} 
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Header Section - Premium Left-Aligned Editorial Style */}
          <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 pb-4 border-b border-brand-border/60">
            <div className="text-left">
              <span className="text-brand-accent text-xs md:text-sm font-sans uppercase tracking-[0.25em] font-bold block mb-3">
                Historical & Cultural Atlas
              </span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-text-primary tracking-tight">
                What Makes Bihar Unique
              </h2>
              <p className="text-text-secondary text-sm md:text-base font-sans font-light max-w-2xl mt-4 leading-relaxed">
                Explore categorized relics, spiritual sanctuaries, and vibrant local folk arts defining Bihar's peerless footprint on human civilization.
              </p>
            </div>

            {/* Grid/Carousel Toggle */}
            <div className="flex items-center bg-white/60 border border-brand-border/60 rounded-full p-1 shadow-sm backdrop-blur-sm self-start lg:self-end">
              <button
                onClick={() => setViewMode("carousel")}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "carousel" 
                    ? "bg-brand-accent text-white shadow-sm" 
                    : "text-text-secondary hover:text-brand-accent"
                }`}
              >
                <LayoutList size={13} />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "grid" 
                    ? "bg-brand-accent text-white shadow-sm" 
                    : "text-text-secondary hover:text-brand-accent"
                }`}
              >
                <Grid size={13} />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* Filters and Search Bar Panel */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 w-full pb-4 border-b border-brand-border/60">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2.5 self-start">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery("");
                    }}
                    className={`relative px-5 py-2.5 rounded-full border text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                        : "bg-white border-brand-border text-text-secondary hover:border-brand-accent hover:text-brand-accent"
                    }`}
                  >
                    {Icon && <Icon size={12} />}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80 self-end">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search legacies, arts, or sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-full border border-brand-border bg-white text-xs font-sans text-text-primary placeholder:text-text-muted outline-none focus:border-brand-accent transition-all duration-300 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand-accent cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Content Renderers */}
          <div className="relative min-h-[400px]">
            {filteredFeatures.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center w-full bg-white rounded-3xl border border-brand-border/60 shadow-sm px-6"
              >
                <Search size={40} className="text-brand-accent mb-4 animate-pulse" />
                <h3 className="font-serif font-bold text-xl text-text-primary mb-2">No Legacies Found</h3>
                <p className="text-text-muted text-sm font-sans font-light max-w-md mb-6">
                  We couldn't find any historical records matching "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-6 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {viewMode === "carousel" ? (
                  /* CAROUSEL VIEW */
                  <motion.div
                    key="carousel-container"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-visible"
                  >
                    <Swiper
                      spaceBetween={24}
                      slidesPerView={1}
                      navigation={{
                        nextEl: ".unique-next",
                        prevEl: ".unique-prev",
                      }}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                      }}
                      modules={[Navigation, Autoplay]}
                      className="py-4"
                    >
                      {filteredFeatures.map((item, index) => (
                        <SwiperSlide key={item.id} className="h-auto">
                          <motion.div
                            layout
                            onClick={() => setSelectedItem(item)}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col h-full bg-white border border-brand-border/60 hover:border-brand-accent/40 rounded-3xl shadow-sm hover:shadow-md overflow-hidden group cursor-pointer"
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden relative">
                              <img decoding="async"
                                src={item.icon}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                              <span className="absolute top-4 left-4 bg-brand-accent/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded font-bold shadow-sm">
                                {item.category === "history" ? "Ancient History" : item.category === "heritage" ? "Sacred Site" : "Culture & Art"}
                              </span>
                            </div>
                            
                            <div className="flex-1 p-6 flex flex-col justify-between min-h-[190px] text-left">
                              <div>
                                <p className="text-brand-accent text-[10px] font-sans font-bold tracking-wider uppercase mb-1.5">
                                  {item.description}
                                </p>
                                <h3 className="text-lg font-serif font-bold text-text-primary mb-2 leading-tight group-hover:text-brand-accent transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-text-secondary font-sans font-light leading-relaxed line-clamp-3">
                                  {item.subtitle}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-border/60">
                                <span className="text-brand-accent text-xs font-sans font-bold flex items-center gap-1 group-hover:underline">
                                  Explore Story <span className="transition-transform group-hover:translate-x-1">→</span>
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Minimal Carousel Navigation Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <div className="unique-prev cursor-pointer bg-white border border-brand-border/60 hover:border-brand-accent text-text-secondary hover:text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-accent hover:scale-105 transition-all shadow-sm">
                        <ChevronLeft size={16} />
                      </div>
                      <div className="unique-next cursor-pointer bg-white border border-brand-border/60 hover:border-brand-accent text-text-secondary hover:text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-accent hover:scale-105 transition-all shadow-sm">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* GRID VIEW WITH WATERFALL ENTRANCE ANIMATION */
                  <motion.div
                    key="grid-container"
                    variants={listVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4"
                  >
                    {filteredFeatures.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={cardVariants}
                        onClick={() => setSelectedItem(item)}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col bg-white border border-brand-border/60 hover:border-brand-accent/40 rounded-3xl shadow-sm hover:shadow-md overflow-hidden group cursor-pointer h-full"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img decoding="async"
                            src={item.icon}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                          <span className="absolute top-3.5 left-3.5 bg-brand-accent/90 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded font-bold shadow-sm">
                            {item.category === "history" ? "Ancient History" : item.category === "heritage" ? "Sacred Site" : "Culture & Art"}
                          </span>
                        </div>
                        
                        <div className="flex-1 p-6 flex flex-col justify-between min-h-[180px] text-left">
                          <div>
                            <p className="text-brand-accent text-[10px] font-sans font-bold tracking-wider uppercase mb-1.5">
                              {item.description}
                            </p>
                            <h3 className="text-lg font-serif font-bold text-text-primary mb-2 leading-tight group-hover:text-brand-accent transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-text-secondary font-sans font-light leading-relaxed line-clamp-3">
                              {item.subtitle}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-border/60">
                            <span className="text-brand-accent text-xs font-sans font-bold flex items-center gap-1 group-hover:underline">
                              Explore Story <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* Modern Detail Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative bg-white border border-brand-border rounded-[2.5rem] max-w-4xl w-full overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 bg-black/50 border border-white/10 hover:border-brand-accent text-white hover:text-white rounded-full p-2.5 transition-all cursor-pointer shadow-lg"
              >
                <X size={16} />
              </button>

              {/* Modal Image Column */}
              <div className="w-full md:w-5/12 h-60 md:h-auto relative overflow-hidden flex-shrink-0">
                <img loading="lazy" decoding="async"
                  src={selectedItem.icon}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="bg-brand-accent text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded font-sans shadow-md">
                    {selectedItem.category === "history" ? "Ancient History" : selectedItem.category === "heritage" ? "Sacred Legacy" : "Culture & Art"}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3.5 leading-tight drop-shadow-md">
                    {selectedItem.title}
                  </h4>
                  <p className="text-brand-gold text-xs mt-1.5 font-medium tracking-wide drop-shadow-sm font-sans">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              {/* Modal Content Column */}
              <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar max-h-[50vh] md:max-h-none text-left">
                <div>
                  <span className="text-brand-accent text-[10px] font-extrabold uppercase tracking-widest mb-2.5 inline-block font-sans">
                    Heritage narrative
                  </span>
                  <p className="text-text-secondary text-sm font-light leading-relaxed mb-6 font-sans">
                    {selectedItem.details}
                  </p>

                  {/* Quick Facts Section */}
                  {selectedItem.facts && (
                    <div className="mb-6 bg-brand-dark/60 p-4 rounded-2xl border border-brand-border/60">
                      <h6 className="text-text-primary text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-brand-border/60 font-sans">
                        Quick Facts
                      </h6>
                      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                        {selectedItem.facts.map((fact, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[9px] text-text-muted uppercase font-extrabold font-sans">
                              {fact.label}
                            </span>
                            <span className="text-xs text-text-secondary font-light mt-0.5 font-sans">
                              {fact.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-brand-border/60">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold rounded-full transition-all shadow-md hover:scale-[1.02] font-sans cursor-pointer"
                  >
                    <span>Read Full Profile</span>
                    <ExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 bg-brand-dark hover:bg-brand-alt/30 text-text-primary text-xs font-semibold rounded-full border border-brand-border hover:border-brand-border-hover transition-all cursor-pointer font-sans"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniqueBihar;
