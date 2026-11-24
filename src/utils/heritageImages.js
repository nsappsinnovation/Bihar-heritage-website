/**
 * Shared heritage image resolver.
 *
 * Excavation/exploration records store their image either as an imported asset
 * (default data) or as a bare filename / URL (CMS data). resolveImage() accepts
 * both and always returns something renderable.
 */
import NalandaImg from "../assets/heritage/NalandaUniversity.webp";
import VikramShilaImg from "../assets/heritage/Vikramshila.webp";
import patliputraImg from "../assets/heritage/patliputraimg.webp";
import rohtasImg from "../assets/heritage/rohtas.webp";
import rajgirImg from "../assets/heritage/rajgir.webp";
import telharaImg from "../assets/heritage/telhara.webp";
import exploration2Img from "../assets/heritage/exploration2.webp";
import LalPahariImg from "../assets/heritage/Laal_Pahari_Lakhisarai.webp";
import BhadariyaImg from "../assets/heritage/bhadariya.webp";
import LariImg from "../assets/heritage/lari.webp";
import KutumbaImg from "../assets/heritage/kutumba.webp";
import GolgharImg from "../assets/heritage/GolgharImg.webp";
import BodhGayaImg from "../assets/heritage/BodhGayaImg.webp";

export const fallbackHeritageImage = NalandaImg;

export const heritageImageMap = {
  "bhadariya.png": BhadariyaImg,
  "Laal_Pahari_Lakhisarai.jpeg": LalPahariImg,
  "lari.png": LariImg,
  "kutumba.png": KutumbaImg,
  "NalandaUniversity.jpg": NalandaImg,
  "Vikramshila.jpg": VikramShilaImg,
  "patliputraimg.jpg": patliputraImg,
  "patliputra.jpg": patliputraImg,
  "rohtas.jpg": rohtasImg,
  "rajgir.jpg": rajgirImg,
  "telhara.jpg": telharaImg,
  "exploration1.jpg":
    "/images/remote/cq5dam-web-1280-765-e0564827.webp",
  "exploration2.jpg": exploration2Img,
  "GolgharImg.jpg": GolgharImg,
  "BodhGayaImg.jpg": BodhGayaImg,
};

export const resolveImage = (img) => {
  if (!img) return fallbackHeritageImage;
  if (typeof img !== "string") return img;
  if (heritageImageMap[img]) return heritageImageMap[img];
  const basename = img.split("/").pop();
  if (heritageImageMap[basename]) return heritageImageMap[basename];
  return img;
};
