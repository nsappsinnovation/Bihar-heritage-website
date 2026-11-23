// PDF Assets
import pdf1 from "../../assets/pdfs/Archaeological Atlas of Bihar.pdf";
import pdf2 from "../../assets/pdfs/Bihar ki lok kathayien Angika, Vajjika maithli.pdf";
import pdf3 from "../../assets/pdfs/Bihar ki lok kathayien Bhojpuri Magahi.pdf";
import pdf4 from "../../assets/pdfs/Bihar me bhasahaon evam lipiyon ka vikas.pdf";
import pdf5 from "../../assets/pdfs/SRI_PRATHAMASIVAPURA_MAHAVIHARA_Excavati.pdf";

// Cover Image Assets
import cover1 from "../../assets/pdfs/image1.webp";
import cover2 from "../../assets/pdfs/image2.webp";
import cover3 from "../../assets/pdfs/image3.webp";
import cover4 from "../../assets/pdfs/image4.webp";

export const defaultPublications = [
  {
    id: 1,
    title: "Archaeological Atlas of Bihar",
    subtitle: "A comprehensive geographical and historical cartography of Bihar's ancient heritage.",
    category: "Archaeological Atlas",
    author: "Bihar Heritage Development Society",
    year: "2024",
    language: "Bilingual (Hindi / English)",
    pages: "184 Pages",
    description: "A detailed cartographic atlas showcasing the vast archaeological richness, centrally and state-protected monuments, stupas, rock art, and excavation sites across all 38 districts of Bihar.",
    cover: cover1,
    pdfUrl: pdf1,
    status: "Published"
  },
  {
    id: 2,
    title: "Folk Tales: Angika, Vajjika, Maithili",
    subtitle: "Oral traditions, folklore, and cultural narratives of Northern and Eastern Bihar.",
    category: "Folk Literature",
    author: "Bihar Heritage Development Society",
    year: "2023",
    language: "Angika, Vajjika, Maithili & Hindi",
    pages: "148 Pages",
    description: "A rich collection of traditional folk tales from the Angika, Vajjika, and Maithili speaking cultural sub-regions, capturing centuries of moral parables, community rituals, and oral history.",
    cover: cover2,
    pdfUrl: pdf2,
    status: "Published"
  },
  {
    id: 3,
    title: "Folk Tales: Bhojpuri, Magahi",
    subtitle: "Cultural narratives, agrarian myths, and folk ballads of South and Western Bihar.",
    category: "Folk Literature",
    author: "Bihar Heritage Development Society",
    year: "2023",
    language: "Bhojpuri, Magahi & Hindi",
    pages: "162 Pages",
    description: "Folk tales capturing the regional narratives, values, cultural expressions, and oral history of Bhojpuri and Magahi cultural domains across the central and southern plains of Bihar.",
    cover: cover2,
    pdfUrl: pdf3,
    status: "Published"
  },
  {
    id: 4,
    title: "Development of Languages and Scripts in Bihar",
    subtitle: "From Brahmi and Kharosthi to Kaithi, Mithilakshar, and Modern Devanagari.",
    category: "Linguistic Heritage",
    author: "Eminent Epigraphists & Scholars",
    year: "2024",
    language: "Hindi & Historical Scripts",
    pages: "210 Pages",
    description: "An academic exploration tracking the lineage, evolution, and developmental stages of ancient scripts, stone inscriptions, copper plates, and regional dialects throughout Bihar's history.",
    cover: cover3,
    pdfUrl: pdf4,
    status: "Published"
  },
  {
    id: 5,
    title: "Prathama Sivapura Mahavihara",
    subtitle: "Excavation and exploration monograph of the ancient monastic university at Lali Pahadi.",
    category: "Excavation Report",
    author: "Archaeological Excavation Team, BHDS",
    year: "2022",
    language: "Bilingual (English / Hindi)",
    pages: "96 Pages",
    description: "The official excavation report document outlining structural findings, terracotta seals, monastery cells, and historical context of Prathama Sivapura Mahavihara at Lali Pahadi, Lakhisarai.",
    cover: cover4,
    pdfUrl: pdf5,
    status: "Published"
  }
];
