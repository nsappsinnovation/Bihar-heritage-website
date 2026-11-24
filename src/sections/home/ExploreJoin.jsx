import React from "react";
import JoinMovement from "../shared/JoinMovement";

import BodhGaya from "../../assets/UniqueBiharImg/BodhGaya.webp";
import NalandaUniversity from "../../assets/UniqueBiharImg/NalandaUniversity.webp";

const heritageSites = [
  {
    title: "Bodh Gaya (Mahabodhi Temple)",
    location: "Gaya, Bihar",
    image: BodhGaya,
    description: "Where Buddha attained enlightenment, a major pilgrimage site and UNESCO World Heritage Site.",
    link: "https://en.wikipedia.org/wiki/Bodh_Gaya",
  },
  {
    title: "Rajgir",
    location: "Nalanda, Bihar",
    image: "/images/remote/125399242rajgir-hot-springs-main-68ccd75b.webp",
    description: "Ancient city with hills, hot springs, and religious significance for Buddhism and Jainism.",
    link: "https://en.wikipedia.org/wiki/Rajgir",
  },
  {
    title: "Nalanda University",
    location: "Nalanda, Bihar",
    image: NalandaUniversity,
    description: "Ancient center of learning, a UNESCO World Heritage Site.",
    link: "https://en.wikipedia.org/wiki/Nalanda_mahavihara",
  },
  {
    title: "Golghar",
    location: "Patna, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Golghar_%E0%A5%AA.jpg",
    description: "A granary with a unique dome structure built in 1786.",
    link: "https://en.wikipedia.org/wiki/Golghar",
  },
  {
    title: "Rohtasgarh Fort",
    location: "Rohtas, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Rohtasgarh_Fort_Entrance.jpg",
    description: "A grand fort nestled in the hills, rich in Mughal history.",
    link: "https://en.wikipedia.org/wiki/Rohtasgarh_Fort",
  },
  {
    title: "Vikramshila University",
    location: "Bhagalpur, Bihar",
    image: "/images/remote/img-20180818-100917-largejpg-89efb28d.webp",
    description: "Ancient university for Buddhist studies like Nalanda.",
    link: "https://en.wikipedia.org/wiki/Vikramashila",
  },
  {
    title: "Vishnupad Temple",
    location: "Gaya, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Vishnupad_temple_gaya_bihar.jpg",
    description: "Ancient Hindu temple with Lord Vishnu's footprint, key site for pind daan rituals.",
    link: "https://en.wikipedia.org/wiki/Vishnupad_Temple",
  },
  {
    title: "Takht Sri Patna Sahib",
    location: "Patna, Bihar",
    image: "/images/remote/patna-sahib-32051468.webp",
    description: "Birthplace of Guru Gobind Singh, one of the five takhts in Sikhism.",
    link: "https://en.wikipedia.org/wiki/Takht_Sri_Patna_Sahib",
  },
  {
    title: "Vaishali",
    location: "Vaishali, Bihar",
    image: "/images/remote/shanti-stupa-vaishali-436b4549.webp",
    description: "Ancient city linked to Buddha's last sermon and Lord Mahavira's birthplace.",
    link: "https://en.wikipedia.org/wiki/Vaishali_(ancient_city)",
  },
  {
    title: "Barabar Caves",
    location: "Jehanabad, Bihar",
    image: "/images/remote/the-barabar-caves-are-27d4a151.webp",
    description: "Oldest rock-cut caves in India, dating to the Mauryan era.",
    link: "https://en.wikipedia.org/wiki/Barabar_Caves",
  },
  {
    title: "Sher Shah Suri Tomb",
    location: "Sasaram, Bihar",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Sher_Shah_Suri_Tomb.jpg",
    description: "Magnificent Indo-Islamic mausoleum, often called the second Taj Mahal.",
    link: "https://en.wikipedia.org/wiki/Tomb_of_Sher_Shah_Suri",
  },
  {
    title: "Maner Sharif",
    location: "Patna, Bihar",
    image: "/images/remote/maner-sharif-dargah-patna-bihar-1-musthe-f0c0d3b1.webp",
    description: "Important Sufi shrine with beautiful Mughal architecture.",
    link: "https://en.wikipedia.org/wiki/Maner_Sharif",
  },
];

const ExploreJoin = () => {
  return (
    <div className="relative z-10">
      <JoinMovement />
    </div>
  );
};

export default ExploreJoin;