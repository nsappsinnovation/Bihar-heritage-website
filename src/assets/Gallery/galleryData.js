// Curated photos for the Photo Gallery page
import MahabodhiTemple from "./mahabodhi-temple.webp";
import BodhGaya from "./bodh-gaya.webp";
import JalMandir from "./jal-mandir.webp";
import PatnaSahib from "./patna-sahib.webp";
import KesariyaStupa from "./kesariya-stupa.webp";
import RohtasFort from "./rohtas-fort.webp";
import Golghar from "./golghar.webp";
import Nalanda from "./nalanda-mahavihara.webp";
import Vikramshila from "./vikramshila.webp";
import BarabarCaves from "./barabar-caves.avif";
import LauriyaPillar from "./lauriya-ashoka-pillar.webp";
import LomasRishi from "./lomas-rishi-cave.webp";
import Rajgir from "./rajgir-ancient-structures.webp";
import Apsadh from "./apsadh.webp";
import Telhara from "./telhara.webp";
import Pataliputra from "./pataliputra.webp";
import Excavation from "./excavation-site.webp";
import ChhathPuja from "./chhath-puja.webp";
import Madhubani from "./madhubani-art.webp";
import FolkPerformance from "./folk-performance.webp";
import Crafts from "./traditional-crafts.webp";
import Kathak from "./kathak.webp";
import MandarHill from "./mandar-hill.webp";
import KutumbaGarh from "./kutumba-garh.webp";

const HERITAGE = "Heritage Site";
const ARCHAEOLOGY = "Archaeological Site";
const CULTURE = "Event & Culture";

// Tags are interleaved so every column gets a mix
export const GALLERY_PHOTOS = [
  { title: "Mahabodhi Temple", tag: HERITAGE, location: "Bodh Gaya", image: MahabodhiTemple },
  { title: "Nalanda Mahavihara", tag: ARCHAEOLOGY, location: "Nalanda", image: Nalanda },
  { title: "Chhath Puja", tag: CULTURE, location: "Patna", image: ChhathPuja },
  { title: "Vikramshila Mahavihara", tag: ARCHAEOLOGY, location: "Bhagalpur", image: Vikramshila },
  { title: "Takht Sri Patna Sahib", tag: HERITAGE, location: "Patna", image: PatnaSahib },
  { title: "Madhubani Painting", tag: CULTURE, location: "Mithila", image: Madhubani },
  { title: "Barabar Caves", tag: ARCHAEOLOGY, location: "Jehanabad", image: BarabarCaves },
  { title: "Kesariya Stupa", tag: HERITAGE, location: "East Champaran", image: KesariyaStupa },
  { title: "Folk Performance", tag: CULTURE, location: "Bihar", image: FolkPerformance },
  { title: "Ashoka Pillar, Lauriya Nandangarh", tag: ARCHAEOLOGY, location: "West Champaran", image: LauriyaPillar },
  { title: "Rohtasgarh Fort", tag: HERITAGE, location: "Rohtas", image: RohtasFort },
  { title: "Traditional Crafts", tag: CULTURE, location: "Bihar", image: Crafts },
  { title: "Lomas Rishi Cave", tag: ARCHAEOLOGY, location: "Jehanabad", image: LomasRishi },
  { title: "Golghar", tag: HERITAGE, location: "Patna", image: Golghar },
  { title: "Kathak Recital", tag: CULTURE, location: "Bihar", image: Kathak },
  { title: "Rajgir Ancient Structures", tag: ARCHAEOLOGY, location: "Rajgir", image: Rajgir },
  { title: "Jal Mandir", tag: HERITAGE, location: "Pawapuri", image: JalMandir },
  { title: "Telhara Excavation", tag: ARCHAEOLOGY, location: "Nalanda", image: Telhara },
  { title: "Bodh Gaya", tag: HERITAGE, location: "Gaya", image: BodhGaya },
  { title: "Apsadh", tag: ARCHAEOLOGY, location: "Nawada", image: Apsadh },
  { title: "Pataliputra Remains", tag: ARCHAEOLOGY, location: "Patna", image: Pataliputra },
  { title: "Excavation in Progress", tag: ARCHAEOLOGY, location: "Bihar", image: Excavation },
  { title: "Mandar Hill", tag: HERITAGE, location: "Banka", image: MandarHill },
  { title: "Kutumba Garh Exploration", tag: ARCHAEOLOGY, location: "Aurangabad", image: KutumbaGarh },
];
