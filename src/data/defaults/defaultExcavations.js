import NalandaImg from "../../assets/heritage/NalandaUniversity.webp";
import VikramShilaImg from "../../assets/heritage/Vikramshila.webp";
import patliputraImg from "../../assets/heritage/patliputraimg.webp";
import rohtasImg from "../../assets/heritage/rohtas.webp";
import rajgirImg from "../../assets/heritage/rajgir.webp";
import telharaImg from "../../assets/heritage/telhara.webp";
import exploration2Img from "../../assets/heritage/exploration2.webp";
import LalPahariImg from "../../assets/heritage/Laal_Pahari_Lakhisarai.webp";
import BhadariyaImg from "../../assets/heritage/bhadariya.webp";
import LariImg from "../../assets/heritage/lari.webp";
import KutumbaImg from "../../assets/heritage/kutumba.webp";
import KesariyaImg from "../../assets/UniqueBiharImg/KesariyaStupa.webp";

export const defaultExcavations = [
  // ─── Excavation Sites (8) ───
  {
    id: "ex-1",
    title: "Nalanda University",
    type: "excavation",
    district: "Nalanda",
    location: "Nalanda District, Bihar (near Rajgir)",
    coordinates: { lat: 25.1357, lng: 85.4438 },
    period: "5th – 13th Century CE",
    lead_agency: "Archaeological Survey of India (ASI)",
    image: NalandaImg,
    map_url: "https://maps.app.goo.gl/wGjDq5yHqU9f5z369",
    description: "Ancient center of learning that attracted scholars from all over Asia. A UNESCO World Heritage Site, it was the world's first residential university, flourishing from the 5th to 13th century with monasteries, stupas, and a vast library.",
    details: `Nalanda University, founded in the 5th century CE, was a prominent center of learning in ancient India, attracting scholars and students from across Asia. It flourished for over 800 years under the Pala dynasty. Renowned for its vast library and diverse curriculum, Nalanda was a major hub for Buddhist studies, as well as medicine, mathematics, astronomy, and philosophy.

Founding and Early Years:
- Established around 427 CE by Emperor Kumaragupta I.
- Functioned as a mahavihara, combining religious study with secular subjects.

Peak of Influence:
- Reached its zenith in the 7th–9th centuries CE (was already at its height when Xuanzang visited in the 7th century).
- Hosted an estimated 10,000 scholars and students.
- Library housed millions of palm-leaf manuscripts.

Notable Scholars:
- Aryabhata is traditionally associated with Nalanda, though direct historical evidence that he studied or taught there is inconclusive.
- Covered subjects like Ayurveda, astronomy, grammar, and Buddhist philosophy.

Decline:
- Experienced a gradual process of decline under the Sena dynasty, culminating in destructive attacks during the invasion of Bakhtiyar Khilji in the late 12th century.

Modern Revival:
- Recently revived on a new campus including sustainable, net-zero infrastructure.`,
    status: "Published"
  },
  {
    id: "ex-2",
    title: "Vikramashila",
    type: "excavation",
    district: "Bhagalpur",
    location: "Antichak, Bhagalpur District, Bihar",
    coordinates: { lat: 25.3247, lng: 87.2829 },
    period: "8th – 12th Century CE (Pala Era)",
    lead_agency: "Archaeological Survey of India (ASI)",
    image: VikramShilaImg,
    map_url: "",
    description: "Another great seat of Buddhist learning with stupas and viharas. Founded by Pala king Dharmapala in the 8th-9th century, it rivaled Nalanda as a major Mahavihara, specializing in Tantric Buddhism.",
    details: `Founded by Pala emperor Dharmapala around the late 8th century CE at Antichak near Bhagalpur, Vikramashila was one of the great Buddhist mahaviharas of its time, specializing in Vajrayāna (Tantric Buddhism). The fortified complex comprised six colleges, a central stupa, and 108 small temples. It housed over 100 teachers and 1,000 students, including the notable scholar Atiśa. The monastery operated under a structured hierarchy, including an abbot, six gate scholars, panditas, and bhikṣus. It thrived as an international center of Buddhist learning until its destruction by Bakhtiyar Khalji's forces around 1193 CE. Its scholars continued to influence Buddhist traditions in Tibet and Sri Lanka.`,
    status: "Published"
  },
  {
    id: "ex-3",
    title: "Patliputra",
    type: "excavation",
    district: "Patna",
    location: "Modern Patna (Kumhrar & surrounding areas), Bihar",
    coordinates: { lat: 25.6017, lng: 85.1783 },
    period: "5th Century BCE – 6th Century CE",
    lead_agency: "Archaeological Survey of India (ASI)",
    image: patliputraImg,
    map_url: "",
    description: "Capital of the Mauryan Empire with palatial ruins and ancient pillars. Known as Pataliputra in ancient times, it was one of the largest cities in the world during the Mauryan era, featuring massive wooden fortifications and the famous 80-pillared hall.",
    details: `Developed from the fortified settlement established by King Ajatashatru around 490 BCE at the confluence of the Ganges, Son, and Gandak rivers, and later made the capital by King Udayin, Patliputra spanned roughly 2.5 km × 15 km and was fortified with wooden palisades, boasting 64 gates and an estimated 570 towers. Excavations at Kumhrar revealed an 80-pillared hall once part of a grand palace; Bulandi Bagh exposed massive wooden walls and the famed Pataliputra capital (a 3rd-century BCE sandstone artifact now in Patna Museum); Agam Kuan, a brick-lined well (≈32 m deep), is linked to Ashokan lore. During the Mauryan period (3rd century BCE), Patliputra was one of the world's largest cities, rich in gold-adorned architecture, gardens, stone pillars, and ponds. It remained the seat of successive dynasties (Haryanka, Nanda, Maurya, Shunga, and Gupta) until decline set in by the 7th century, when Xuanzang described it as largely in ruins.`,
    status: "Published"
  },
  {
    id: "ex-4",
    title: "Rohtasgarh Fort",
    type: "excavation",
    district: "Rohtas",
    location: "Rohtas District, Bihar (near Sasaram)",
    coordinates: { lat: 24.623, lng: 83.915 },
    period: "7th – 17th Century CE",
    lead_agency: "Directorate of Archaeology & ASI",
    image: rohtasImg,
    map_url: "",
    description: "Massive medieval fort with underground structures and battle remains. Perched on a hilltop, it was a strategic stronghold with ancient origins, later used by rulers like Sher Shah Suri and Mughal governors.",
    details: `Perched ~1,500 ft atop the Kaimur hills overlooking the Son River, Rohtasgarh has roots as early as the 7th century, when the Gauda king Shashanka inscribed the site. By 1223 CE, it belonged to the Khayaravala ruler Śrī-Pratāpa, who repelled a Muslim army. In 1539, Sher Shah Suri captured the fort. According to popular tradition, he gained entry by concealing soldiers in palanquins and later stationed a 10,000-strong garrison there. His general Haibat Khan built the three-domed white sandstone Jami Masjid and mausoleum in 1543. Under Akbar's general Raja Man Singh (1558), the fort became a Mughal stronghold featuring the four-storied Takht-e-Badshahi palace, Aina Mahal, Persian gardens, ponds, the ornate Hathiya Pol gate (1597), and temples of Ganesh and Shiva. The citadel spans some 70 ha, with over 4 km of sandstone ramparts, 68 bastions, 83 gates, machicolations, and underground passages. Later used by Prince Khurram (Shah Jahan), as a Mughal prison under Aurangzeb, briefly held by the British, and as a rebel bastion during the 1857 uprising, the fort remains in impressive ruins—a testament to Hindu, Afghan, and Mughal legacies, yet largely unrestored.`,
    status: "Published"
  },
  {
    id: "ex-5",
    title: "Rajgir Hills",
    type: "excavation",
    district: "Nalanda",
    location: "Rajgir, Nalanda District, Bihar",
    coordinates: { lat: 25.02, lng: 85.42 },
    period: "6th Century BCE (Magadha Era)",
    lead_agency: "Archaeological Survey of India (ASI)",
    image: rajgirImg,
    map_url: "",
    description: "Rich archaeological remains of Buddhist and Jain heritage. Ancient capital of Magadha, encircled by cyclopean walls and hills where Buddha delivered many sermons; features hot springs and ancient fortifications.",
    details: `Rajgir, ancient Rajagriha, was the early capital of Magadha under Bimbisara (c. 540–491 BCE) and Ajatashatru, enfolded by massive cyclopean walls along five quartzite ridges (elev. ~388 m). It became a focal site of Buddhism and Jainism—Buddha taught at Vulture's Peak (Gridhrakūṭa), and the Saptaparni Cave hosted the First Buddhist Council. The Son Bhandar Caves contain 3rd–4th century CE Jain inscriptions and are traditionally linked to Bimbisara's treasures. Mahavira also spent multiple chaturmases here, and numerous ancient Jain temples remain. Archaeological excavations have revealed Bimbisara's prison, Ajatashatru's fort, Maniyar Math, and evidence of habitation from the Palaeolithic through the Pala period. At its foot, the Brahmakund hot springs (≈45 °C) are revered for their healing properties. Modern amenities include a ropeway to the Peace Pagoda, hill trails, panoramic views, and cycling paths, making Rajgir both a spiritual and scenic heritage destination.`,
    status: "Published"
  },
  {
    id: "ex-6",
    title: "Telhara Monastery",
    type: "excavation",
    district: "Nalanda",
    location: "Telhara, Nalanda District, Bihar",
    coordinates: { lat: 25.235, lng: 85.238 },
    period: "1st – 12th Century CE",
    lead_agency: "Directorate of Archaeology, Bihar",
    image: telharaImg,
    map_url: "",
    description: "Buddhist monastery ruins linked to ancient Magadha's monastic tradition. Mentioned by Chinese traveler Xuanzang as Teladhaka, it was a significant Mahavihara active from the 1st to 12th century with multiple monasteries.",
    details: `Telhara (ancient Telāḍhaka), in Nalanda district, was a major Buddhist Mahāvihāra active from the 1st century CE to the 12th century CE. First described by the Chinese traveller Xuanzang in the 7th century, excavations (2009–14, 2020–22) unearthed a three-storeyed monastery complex, prayer halls, residential cells, and stupas across successive layers from the Northern Black Polished Ware period (3rd century BCE) through the Kushan, Gupta, Pāla, and Sena periods. Over a thousand artefacts—including terracotta monastery seals, pottery, bronze and basalt Buddha statues (in Abhay and Dharmacakra mudrās), rich Pāla-era sculptures, and inscriptions—affirm its links to the Buddhist learning networks of Nalanda. Evidence of a thick ash layer suggests destruction during Bakhtiyar Khilji's invasion in the late 12th century. Chinese accounts mention seven viharas housing around 1,000 monks. Mentioned in the Ain-i-Akbari as a Mughal pargana, its ruins include a later mosque built using monastery stones. Today, the site remains under excavation, with plans for a site museum and renewed scholarly interest.`,
    status: "Published"
  },
  {
    id: "ex-7",
    title: "Bhadariya Excavation",
    type: "excavation",
    district: "Banka",
    location: "Amarpur, Banka District, Bihar",
    coordinates: { lat: 24.98, lng: 86.88 },
    period: "6th Century BCE (Buddha Era) - Active Dig",
    lead_agency: "Bihar Heritage Development Society (BHDS) & ASI",
    image: BhadariyaImg,
    map_url: "",
    description: "Active excavation site on the Chandan River uncovering a 2,600-year-old ancient settlement with burnt brick walls, terracotta ring wells, and artifacts dating back to the 6th Century BCE Buddha era.",
    details: `Discovered on the banks of the Chandan River near Amarpur block in Banka district during Chhath Puja preparations, Bhadariya has emerged as one of Bihar's most significant archaeological discoveries in recent years.

Key Excavation Discoveries:
- Structural remains of burnt brick walls, terracotta ring wells, and ancient pottery dating back over 2,600 years (6th century BCE).
- Ground-Penetrating Radar (GPR) survey conducted by IIT Kanpur experts to map subsurface structures without destruction.
- Historical links to Buddhist literature mentioning Lord Buddha's visit to the region and the residence of his devout disciple Visakha near Mandar Hill.

Government & BHDS Mandate:
- Chief Minister Nitish Kumar inspected the site and directed comprehensive excavation and riverbed restoration by the Bihar Heritage Development Society (BHDS) and ASI to preserve this ancient Gangetic civilization hub.`,
    status: "Published"
  },
  {
    id: "ex-8",
    title: "Lal Pahari Excavation",
    type: "excavation",
    district: "Lakhisarai",
    location: "Lakhisarai District, Bihar",
    coordinates: { lat: 25.17, lng: 86.1 },
    period: "9th – 11th Century CE (Pala Era)",
    lead_agency: "BHDS & Visva-Bharati University",
    image: LalPahariImg,
    map_url: "",
    description: "The first excavated hilltop Buddhist Mahavihara in Bihar. Joint BHDS & Visva-Bharati research revealed a 9th-11th century Pala-era monastic complex headed by female Buddhist monastic leaders.",
    details: `Situated atop the Lal Pahari hill in Lakhisarai, this site represents the first scientifically excavated hilltop Buddhist monastery (Mahavihara) in Bihar, jointly excavated by the Bihar Heritage Development Society (BHDS) and Visva-Bharati University, Santiniketan.

Architectural & Epigraphic Significance:
- Inscribed clay seals recovered from the excavation bear the legend 'Srimad-Dharmavihar-Arya-Bhikshu-Sanghasya', officially confirming the monastery's historical name.
- Features cella, central shrine, wooden structures, terracotta plaques, and decorative molded bricks reflecting Pala dynasty patronage.
- Uniquely documents the prominence of female Buddhist monks and patrons within the monastic hierarchy of medieval Magadha.

Heritage Protection:
- Declared a protected state monument, ongoing conservation by BHDS aims to preserve the structural walls and develop a dedicated site interpretation center.`,
    status: "Published"
  },

  // ─── Exploration Activities (8) ───
  {
    id: "ex-9",
    title: "Rohtasgarh Tunnel Study",
    type: "exploration",
    district: "Rohtas",
    location: "Rohtasgarh Fort, Rohtas District, Bihar",
    coordinates: { lat: 24.625, lng: 83.917 },
    period: "Medieval Era (Subterranean Analysis)",
    lead_agency: "BHDS & Historical Survey Team",
    image: "/images/remote/cq5dam-web-1280-765-e0564827.webp",
    map_url: "",
    description: "Ongoing study on underground tunnels in Rohtasgarh by historians. Exploring the fort's hidden passages and structures for insights into medieval defense and architecture.",
    details: `Recent archaeological work at Rohtasgarh Fort—one of India's largest and most extensive hill fort complexes spanning over 42 km² of plateau—has turned scholarly attention to its extensive underground network of tunnels and chambers. According to historical records and ongoing surveys, the fort contains a complex network of underground tunnels, historically believed to have served as escape routes or secret passageways during sieges. On-site investigations at the Bada Angana courtyard have revealed hidden stairways leading into vaulted chambers with domes and ventilators, including large underground halls like the 'Nach-ghar' (dancing hall) (~48 × 45 ft) and the 'Raniwas' (~59 × 37 ft), hinting at elaborate subterranean planning.`,
    status: "Published"
  },
  {
    id: "ex-10",
    title: "Chausa Excavation",
    type: "exploration",
    district: "Buxar",
    location: "Chausa, Buxar District, Bihar",
    coordinates: { lat: 25.518, lng: 83.856 },
    period: "Gupta & Kushan Era (4th–6th Century CE)",
    lead_agency: "ASI Patna Circle",
    image: exploration2Img,
    map_url: "",
    description: "Discovery of coins, seals, and terracotta figurines from the Gupta period. Famous for the Chausa bronze hoard of Jain images, one of the earliest metal artifact collections in the Gangetic valley.",
    details: `Excavations and explorations at Chausa near Buxar, celebrated for the landmark 1931 discovery of the Chausa Hoard (18 ancient Jain bronze sculptures dating from the 1st century BCE to the Gupta era), have revealed significant archaeological evidence confirming deep antiquity. Recent archaeological surveys have unearthed coins and seals from the Gupta era (4th–6th century CE), terracotta figurines, and ancient brick foundations, pointing to a well-organized ancient riverine settlement. The site, also famous as the battleground of Humayun and Sher Shah Suri in 1539 CE, demonstrates continuous strategic occupation across ancient and medieval Indian history.`,
    status: "Published"
  },
  {
    id: "ex-11",
    title: "Kesaria Stupa Mapping",
    type: "exploration",
    district: "East Champaran",
    location: "Kesaria, East Champaran District, Bihar",
    coordinates: { lat: 26.3345, lng: 84.8546 },
    period: "3rd Century BCE – 8th Century CE",
    lead_agency: "ASI & GIS Survey Unit",
    image: KesariyaImg,
    map_url: "",
    description: "GIS-based exploration of the massive Kesaria Buddhist stupa in East Champaran. The tallest excavated stupa in the world (104 ft), linked to Buddha's alms bowl gift and expanded from Ashoka's era.",
    details: `The 32 m–high Kesaria Stupa in East Champaran, Bihar—one of the tallest Buddhist stupas in India—was originally built in the 3rd century BCE under Ashoka and later expanded during the Gupta–Pala periods (~200–750 CE). Recent GIS-based mapping and ASI excavations (1997–98; Patna Circle and Patna Branch in 2018–19) have revealed its full architectural plan: a 31.5 m high terraced stupa (c. 123 m base diameter) with six concentric circular terraces and a massive base wall, possibly extending the diameter to 167 m. Dozens of cell-shrines with stucco Buddha figures, ornamental geometric patterns, perimeter moats, pradakshina-paths (circumambulation walk), and relic casket chambers have been mapped. Additional nearby excavations at the Raniwas mound uncovered an extensive monastic complex—cells, corridors, and stupas—suggesting a functional satellite vihara connected to Kesaria. The combined insights from GIS-mapping and stratigraphic excavation are reshaping scholarly understanding of large-scale stupa planning in ancient India.`,
    status: "Published"
  },
  {
    id: "ex-12",
    title: "Sasaram Tombs Documentation",
    type: "exploration",
    district: "Rohtas",
    location: "Sasaram, Rohtas District, Bihar",
    coordinates: { lat: 24.9476, lng: 84.0137 },
    period: "1540 – 1545 CE (Sur Dynasty)",
    lead_agency: "ASI Digital Documentation Wing",
    image: rohtasImg,
    map_url: "",
    description: "Ongoing digital documentation of Sher Shah Suri's tomb and related sites. A stunning octagonal mausoleum in a lake, exemplifying Indo-Islamic architecture from the Sur Empire.",
    details: `The monumental tomb of Sher Shah Suri in Sasaram, Bihar—often called the "Second Taj"—was built between 1540 and 1545 by Mir Muhammad Aliwal Khan in Indo-Islamic (Afghan-Mughal) style. Standing 122 ft tall on a three-tiered octagonal plinth at the center of a 22-acre artificial lake (approx. 1,130 × 865 ft), it features an elegant full-height dome (22 m span), chhatris at each corner of the second and third stories, and a surrounding verandah with 24 smaller domes and arched openings.

Carved with Quranic verses and intricate floral motifs, the tomb was originally decorated with glazed tiles in blue and yellow hues. Today, the Archaeological Survey of India (ASI) is actively restoring the site—cleaning the lake and inlet canal, installing solar lighting, landscape beautification, and conducting digital archival documentation.`,
    status: "Published"
  },
  {
    id: "ex-13",
    title: "Nalanda Digital Reconstruction",
    type: "exploration",
    district: "Nalanda",
    location: "Nalanda University Ruins, Nalanda District, Bihar",
    coordinates: { lat: 25.1365, lng: 85.4445 },
    period: "Contemporary AR/VR 3D Modeling",
    lead_agency: "Ministry of Culture & ASI",
    image: NalandaImg,
    map_url: "",
    description: "3D mapping and AR visualization efforts by the Archaeological Survey of India. Reviving the ancient university's layout through modern technology for education and tourism.",
    details: `Under the Archaeological Survey of India and the Ministry of Culture, an ongoing effort is underway to digitally restore Nalanda Mahavihara, using 3D modeling, GIS mapping, and AR/VR technologies to recreate its ancient architecture and libraries. A pilot AR/VR visualization project aims to give visitors an immersive sense of Nalanda's grandeur as it once stood. GIS-based studies using satellite multispectral data have already mapped the full archaeological extent—revealing outlying ruins far beyond the core area, and integrating historical survey data into a layered spatial model.`,
    status: "Published"
  },
  {
    id: "ex-14",
    title: "Vikramshila River Excavation",
    type: "exploration",
    district: "Bhagalpur",
    location: "Antichak Riverbed, Bhagalpur District, Bihar",
    coordinates: { lat: 25.326, lng: 87.285 },
    period: "Pala Period Riverine Artifacts",
    lead_agency: "ASI Maritime & Riverine Wing",
    image: VikramShilaImg,
    map_url: "",
    description: "River-side excavation near Vikramshila for trade route relics. Uncovering artifacts along the Ganges to understand ancient trade and monastic life at this Pala-era university.",
    details: `Excavations near the ancient river channel adjacent to the Vikramshila Mahavihara—conducted after ASI resumed work in early 2024—have uncovered a wide array of Pala-period artifacts. These include terracotta plaques, human and animal figurines, beads of stone, glass, and terracotta, stone and bronze Buddhist and Hindu images (e.g., Buddha, Avalokiteśvara, Manjushri, Tara), seals and sealings, and household pottery and metal finds such as coins and copper rings. The finds suggest river-based trade activity, evidenced by beads and pottery types—alongside votive stupas and stupa remnants—highlighting the site's role in monastic life and commerce during the Pala dynasty.`,
    status: "Published"
  },
  {
    id: "ex-15",
    title: "Lari Mound Exploration",
    type: "exploration",
    district: "Arwal",
    location: "Kurtha, Jehanabad / Arwal District, Bihar",
    coordinates: { lat: 25.045, lng: 84.821 },
    period: "Pre-Mauryan to Pala Era",
    lead_agency: "Bihar Heritage Development Society (BHDS)",
    image: LariImg,
    map_url: "",
    description: "Exploration of an expansive 27-acre ancient mound by BHDS, documenting multi-layered habitation from pre-Mauryan and NBPW eras to the Pala dynasty with surface finds of punch-marked coins and pottery.",
    details: `Located in the Kurtha region (historically part of greater Jehanabad district), Lari features a massive 27-acre archaeological mound that preserves over two millennia of continuous human settlement.

Key Exploration Finds:
- Continuous occupational sequence spanning Pre-Mauryan, Northern Black Polished Ware (NBPW), Mauryan, Gupta, and Pala historical periods.
- Surface explorations and soil sampling yielded ancient punch-marked coins, terracotta ring wells, clay sealings, iron artifacts, and residential brick walls.
- Significant evidence of early urban planning and craftsmanship in ancient Magadha along regional trade corridors.

Ongoing Research:
- Explorations and survey initiatives by the Bihar Heritage Development Society (BHDS) aim to map the full extent of the mound and secure permanent protection under archaeological preservation acts.`,
    status: "Published"
  },
  {
    id: "ex-16",
    title: "Kutumba Garh Exploration",
    type: "exploration",
    district: "Aurangabad",
    location: "Amba / Kutumba, Aurangabad District, Bihar",
    coordinates: { lat: 24.6214, lng: 84.2381 },
    period: "Gupta & Medieval Era",
    lead_agency: "Bihar State Archaeology & BHDS",
    image: KutumbaImg,
    map_url: "",
    description: "Archaeological surface survey and trenching proposal at Kutumba Garh fort mound, discovering Gupta-era brick structures, terracotta figurines, coins, and ancient stone carvings.",
    details: `Kutumba Garh in the Kutumba/Amba block of Aurangabad district is a historic fort mound site recognized for its deep archaeological potential and strategic location in south-western Bihar.

Archaeological Highlights:
- Uncovered remnants of ancient brick fortifications, structural walls, terracotta figurines, and stone sculptures reflecting Gupta and post-Gupta craftsmanship.
- Yielded historical inscriptions and coins pointing to a fortified administrative and military stronghold in early medieval Magadha.
- Surface explorations and trenching by Bihar State Archaeology and BHDS have identified multi-period cultural deposits.

Development & Conservation:
- Highlighted by state heritage authorities for expanded scientific excavation and inclusion in Bihar's archaeological tourism itinerary.`,
    status: "Published"
  }
];
