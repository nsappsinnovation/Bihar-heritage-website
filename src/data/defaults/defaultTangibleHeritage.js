import heritageData from "../biharHeritage.json";
import { heritageImageMap } from "../../pages/IntangibleHeritage/heritageImages";

export const defaultTangibleHeritage = heritageData.heritages.map((item) => {
  const localImg = (item.imageKey && heritageImageMap[item.imageKey]) || (item.id && heritageImageMap[item.id]) || null;
  return {
    ...item,
    status: item.status || "Published",
    image: localImg || item.image || item.imageUrl || null
  };
});
