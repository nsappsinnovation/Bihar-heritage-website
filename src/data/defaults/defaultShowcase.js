// Default dataset for Home Page Showcase: Bihar Heritage Archives & Popular Heritage Sites

import MahabodhiImg from "../../assets/UniqueBiharImg/MahabodhiTemple.webp";
import VikramshilaImg from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import JalMandirImg from "../../assets/GalleryImg/JalMandir.webp";
import PatnaSahibImg from "../../assets/UniqueBiharImg/PatnaSahib.webp";
import BodhGayaImg from "../../assets/GalleryImg/BodhGaya.webp";
import ShantiBabaImg from "../../assets/GalleryImg/ShantiBaba.webp";
import RohtasFortImg from "../../assets/UniqueBiharImg/RohtasFort.webp";
import NalandaImg from "../../assets/UniqueBiharImg/NalandaUniversity.webp";
import VaishaliImg from "../../assets/GalleryImg/VaishaliBihar.webp";
import AjatshatruImg from "../../assets/GalleryImg/AjatshatruFort.avif";

export const defaultHeritageArchives = [
  {
    id: 1,
    title: "Mahabodhi Temple",
    category: "Sacred",
    location: "Bodh Gaya, Gaya",
    image: MahabodhiImg,
    description: "The sacred site where Siddhartha Gautama attained supreme enlightenment under the sacred Bodhi Tree, marking the foundation of Buddhism.",
    year: "3rd Century BCE (Ashokan Foundation)",
    significance: "UNESCO World Heritage Site",
    link: "https://en.wikipedia.org/wiki/Mahabodhi_Temple",
    status: "Published"
  },
  {
    id: 2,
    title: "Nalanda Mahavihara",
    category: "Ruins",
    location: "Nalanda, Bihar",
    image: NalandaImg,
    description: "The monumental ruins of the ancient residential university and Buddhist monastic center that hosted 10,000 scholars from across Asia.",
    year: "5th Century CE",
    significance: "UNESCO World Heritage Site",
    link: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
    status: "Published"
  },
  {
    id: 3,
    title: "Rohtasgarh Fort",
    category: "Monuments",
    location: "Rohtas Hills, Rohtas",
    image: RohtasFortImg,
    description: "Perched 1,500 feet high on the Kaimur plateau, this massive hill fort features monumental stone gates, temples, and palaces expanded under Sher Shah Suri and Raja Man Singh.",
    year: "7th Century CE (Expanded 16th Century CE)",
    significance: "Impregnable Hilltop Citadel",
    link: "https://en.wikipedia.org/wiki/Rohtasgarh_Fort",
    status: "Published"
  },
  {
    id: 4,
    title: "Vikramshila University",
    category: "Ruins",
    location: "Antichak, Bhagalpur",
    image: VikramshilaImg,
    description: "One of the premier centers of Buddhist learning in India during the Pala Empire, established by King Dharmapala.",
    year: "8th Century CE",
    significance: "Pala Buddhist Education Center",
    link: "https://en.wikipedia.org/wiki/Vikramashila",
    status: "Published"
  },
  {
    id: 5,
    title: "Jal Mandir (Pawapuri)",
    category: "Sacred",
    location: "Pawapuri, Nalanda",
    image: JalMandirImg,
    description: "A serene temple built in pristine white marble in the center of a lotus lake, commemorating where Lord Mahavira attained Nirvana.",
    year: "6th Century BCE (Tradition)",
    significance: "Sacred Jain Pilgrimage Site",
    link: "https://en.wikipedia.org/wiki/Jal_Mandir,_Pawapuri",
    status: "Published"
  },
  {
    id: 6,
    title: "Kesariya Stupa",
    category: "Monuments",
    location: "East Champaran, Bihar",
    image: "https://kesariyastupa.com/stupa-images/kesariya-stupa-cover-oo_aadi.jpg",
    description: "One of the tallest and largest Buddhist stupas in the world, having Mauryan origins and developed into a multi-tiered circular monument during the Gupta period.",
    year: "3rd Century BCE – Gupta Period",
    significance: "World's Largest Buddhist Stupa",
    link: "https://en.wikipedia.org/wiki/Kesariya_stupa",
    status: "Published"
  },
  {
    id: 7,
    title: "Takht Sri Patna Sahib",
    category: "Sacred",
    location: "Patna City, Patna",
    image: PatnaSahibImg,
    description: "One of the five holy Takhts of Sikhism, built by Maharaja Ranjit Singh to commemorate the birthplace of Guru Gobind Singh Ji, the tenth Sikh Guru.",
    year: "19th Century CE (Birthplace 1666 CE)",
    significance: "Takht of the Sikh Panth",
    link: "https://en.wikipedia.org/wiki/Takht_Sri_Patna_Sahib",
    status: "Published"
  },
  {
    id: 8,
    title: "Ajatshatru Fort",
    category: "Ancient",
    location: "Rajgir, Nalanda",
    image: AjatshatruImg,
    description: "Built by the Magadha king Ajatshatru of the Haryanka dynasty in the 6th–5th century BCE, this ancient fortification is surrounded by scenic hills and cyclopean stone walls.",
    year: "6th–5th Century BCE",
    significance: "Early Magadha Defensive Citadel",
    link: "https://en.wikipedia.org/wiki/Ajatashatru",
    status: "Published"
  },
  {
    id: 9,
    title: "Barabar Caves",
    category: "Ancient",
    location: "Makhdumpur, Jehanabad",
    image: "https://hblimg.mmtcdn.com/content/hubble/img/gaya_imgs/mmt/activities/m_Barabar_caves_3_l_400_600.jpg",
    description: "The oldest surviving rock-cut caves in India, carved out of massive granite boulders with glass-like internal polish during the Mauryan Empire under Emperor Ashoka.",
    year: "3rd Century BCE (c. 261 BCE)",
    significance: "Oldest Rock-Cut Caves in India",
    link: "https://en.wikipedia.org/wiki/Barabar_Caves",
    status: "Published"
  }
];

export const defaultPopularSites = [
  {
    id: 1,
    title: "Bodh Gaya",
    subtitle: "The cradle of Buddhism and a revered global pilgrimage site. It is where Prince Siddhartha Gautama sat beneath the sacred Bodhi Tree in deep meditation and attained supreme spiritual enlightenment (Bodhi).",
    location: "Gaya, Bihar",
    image: BodhGayaImg,
    wikipedia: "https://en.wikipedia.org/wiki/Bodh_Gaya",
    status: "Published"
  },
  {
    id: 2,
    title: "Jal Mandir",
    subtitle: "A revered white marble Jain temple constructed in the center of a lotus-filled lake. It marks the sacred spot where Lord Mahavira, the 24th Tirthankara, attained Nirvana and was cremated in 527 BCE.",
    location: "Pawapuri, Nalanda",
    image: JalMandirImg,
    wikipedia: "https://en.wikipedia.org/wiki/Jal_Mandir,_Pawapuri",
    status: "Published"
  },
  {
    id: 3,
    title: "Mahabodhi Temple",
    subtitle: "A UNESCO World Heritage site and monumental 55-meter brick temple complex. Features the sacred Bodhi Tree, the polished sandstone Vajrasana (Diamond Throne), and foundations dating back to Emperor Ashoka (3rd c. BCE).",
    location: "Bodh Gaya, Bihar",
    image: MahabodhiImg,
    wikipedia: "https://en.wikipedia.org/wiki/Mahabodhi_Temple",
    status: "Published"
  },
  {
    id: 4,
    title: "Shanti Baba Mandir",
    subtitle: "A serene spiritual sanctuary and ashram situated along the rocky banks of the Ganges in Kahalgaon. Known for meditation retreats and panoramic vistas of the holy river.",
    location: "Kahalgaon, Bhagalpur",
    image: ShantiBabaImg,
    wikipedia: "https://en.wikipedia.org/wiki/Kahalgaon",
    status: "Published"
  },
  {
    id: 5,
    title: "Rohtasgarh Fort",
    subtitle: "One of India's largest hill fort complexes spanning over 42 km² atop the Kaimur plateau. It features medieval palaces, gates, and temples built by ancient Hindu kings and later fortified by Sher Shah Suri and Raja Man Singh.",
    location: "Rohtas, Bihar",
    image: RohtasFortImg,
    wikipedia: "https://en.wikipedia.org/wiki/Rohtasgarh_Fort",
    status: "Published"
  },
  {
    id: 6,
    title: "Nalanda Ruins",
    subtitle: "The excavated UNESCO World Heritage remnants of the ancient world's premier residential monastic university. Flourishing between the 5th and 12th centuries CE, it housed over 10,000 scholars from across Asia.",
    location: "Nalanda, Bihar",
    image: NalandaImg,
    wikipedia: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
    status: "Published"
  },
  {
    id: 7,
    title: "Takht Sri Patna Sahib",
    subtitle: "One of the five sacred Takhts of Sikhism, situated on the banks of the Ganges. It marks the birthplace of Guru Gobind Singh Ji (1666 CE), the tenth Sikh Guru, and enshrines revered historical relics.",
    location: "Patna, Bihar",
    image: PatnaSahibImg,
    wikipedia: "https://en.wikipedia.org/wiki/Takht_Sri_Patna_Sahib",
    status: "Published"
  },
  {
    id: 8,
    title: "Vikramshila University",
    subtitle: "Founded by Pala Emperor Dharmapala in the late 8th century CE. It served as a premier global center for Vajrayana Buddhist philosophy, logic, and ancient sciences under master Atisa Dipankara.",
    location: "Bhagalpur, Bihar",
    image: VikramshilaImg,
    wikipedia: "https://en.wikipedia.org/wiki/Vikramashila",
    status: "Published"
  },
  {
    id: 9,
    title: "Vaishali Stupa & Pillar",
    subtitle: "Ancient capital of the Vajji republic—one of the world's earliest democracies. It is where Lord Buddha delivered his last sermon and features an intact monolithic Ashokan Lion Pillar and relic stupas.",
    location: "Vaishali, Bihar",
    image: VaishaliImg,
    wikipedia: "https://en.wikipedia.org/wiki/Vaishali_(ancient_city)",
    status: "Published"
  },
  {
    id: 10,
    title: "Ajatshatru Fort",
    subtitle: "Built in the 5th–6th century BCE by King Ajatashatru of the Haryanka dynasty, ruler of the Magadha Empire. The historic stone citadel and watchtowers represent one of India's earliest surviving military defense fortifications.",
    location: "Rajgir, Nalanda",
    image: AjatshatruImg,
    wikipedia: "https://en.wikipedia.org/wiki/Rajgir",
    status: "Published"
  }
];

import video1 from "../../assets/Videos/BiharHeritage1.mp4";
import video2 from "../../assets/Videos/BiharHeritage_2.mp4";
import video3 from "../../assets/Videos/BiharHistory.mp4";

export const defaultLivingHeritageVideos = [
  {
    id: 1,
    title: "Heritage Chronicles",
    category: "Documentary Reel",
    duration: "03:45",
    author: "@BiharArchaeology",
    views: "18.4K views",
    url: video2,
    desc: "A cinematic aerial journey documenting the sacred monasteries, monolithic Ashokan pillars, and stupas of Bihar.",
    status: "Published"
  },
  {
    id: 2,
    title: "Echoes of Antiquity",
    category: "Short Vignette",
    duration: "01:20",
    author: "@HeritageBihar",
    views: "24.1K views",
    url: video1,
    desc: "A spiritual look into the timeless sunrise rituals, prayers, and cultural gatherings across sacred heritage sites.",
    status: "Published"
  },
  {
    id: 3,
    title: "Wisdom of the Ages",
    category: "Historical Study",
    duration: "04:10",
    author: "@Archaeology_India",
    views: "15.9K views",
    url: video3,
    desc: "A documentary detailing the ancient wisdom, universities, and empires of the Magadha region.",
    status: "Published"
  }
];
