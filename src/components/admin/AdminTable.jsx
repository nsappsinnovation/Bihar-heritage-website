import React from "react";
import { Pencil, Trash2, Eye, FileText, User, Tag, Lock } from "lucide-react";
import StatusBadge from "./StatusBadge";

// Heritage image assets
import NalandaImg from "../../assets/heritage/NalandaUniversity.webp";
import VikramShilaImg from "../../assets/heritage/Vikramshila.webp";
import patliputraImg from "../../assets/heritage/patliputraimg.webp";
import rohtasImg from "../../assets/heritage/rohtas.webp";
import rajgirImg from "../../assets/heritage/rajgir.webp";
import telharaImg from "../../assets/heritage/telhara.webp";
import exploration1Img from "../../assets/heritage/exploration1.webp";
import exploration2Img from "../../assets/heritage/exploration2.webp";
import LalPahariImg from "../../assets/heritage/Laal_Pahari_Lakhisarai.webp";
import BhadariyaImg from "../../assets/heritage/bhadariya.webp";
import LariImg from "../../assets/heritage/lari.webp";
import KutumbaImg from "../../assets/heritage/kutumba.webp";
import GolgharImg from "../../assets/heritage/GolgharImg.webp";
import BodhGayaImg from "../../assets/heritage/BodhGayaImg.webp";
import BodhGayaWebp from "../../assets/GalleryImg/BodhGaya.webp";
import JalMandirImg from "../../assets/GalleryImg/JalMandir.webp";
import MahabodhiJpg from "../../assets/GalleryImg/MahabodhiTemple.webp";
import MahabodhiWebp from "../../assets/UniqueBiharImg/MahabodhiTemple.webp";
import ShantiBabaImg from "../../assets/GalleryImg/ShantiBaba.webp";
import RohtasFortWebp from "../../assets/UniqueBiharImg/RohtasFort.webp";
import PatnaSahibJpeg from "../../assets/UniqueBiharImg/PatnaSahib.webp";
import VikramshilaPng from "../../assets/UniqueBiharImg/VIKRAMSHILA_UNIVERSITY.webp";
import VaishaliWebp from "../../assets/GalleryImg/VaishaliBihar.webp";
import AjatshatruAvif from "../../assets/GalleryImg/AjatshatruFort.avif";

const imageMap = {
  "bhadariya.png": BhadariyaImg,
  "Laal_Pahari_Lakhisarai.jpeg": LalPahariImg,
  "lari.png": LariImg,
  "kutumba.png": KutumbaImg,
  "NalandaUniversity.jpg": NalandaImg,
  "Vikramshila.jpg": VikramShilaImg,
  "VIKRAMSHILA_UNIVERSITY.png": VikramshilaPng,
  "patliputraimg.jpg": patliputraImg,
  "patliputra.jpg": patliputraImg,
  "rohtas.jpg": rohtasImg,
  "RohtasFort.webp": RohtasFortWebp,
  "rajgir.jpg": rajgirImg,
  "telhara.jpg": telharaImg,
  "exploration1.jpg": exploration1Img,
  "exploration2.jpg": exploration2Img,
  "GolgharImg.jpg": GolgharImg,
  "BodhGayaImg.jpg": BodhGayaImg,
  "BodhGaya.webp": BodhGayaWebp,
  "JalMandir.jpg": JalMandirImg,
  "MahabodhiTemple.jpg": MahabodhiJpg,
  "MahabodhiTemple.webp": MahabodhiWebp,
  "ShantiBaba.jpg": ShantiBabaImg,
  "PatnaSahib.jpeg": PatnaSahibJpeg,
  "VaishaliBihar.webp": VaishaliWebp,
  "AjatshatruFort.avif": AjatshatruAvif,
};

const resolveTableImage = (img) => {
  if (!img) return null;
  if (typeof img !== "string") return img;
  if (imageMap[img]) return imageMap[img];
  const basename = img.split("/").pop();
  if (imageMap[basename]) return imageMap[basename];
  return img;
};

const categoryStyles = {
  Architecture: "bg-blue-50/90 text-blue-800 border-blue-200/80",
  Archaeology: "bg-amber-50/90 text-amber-900 border-amber-200/80",
  Culture: "bg-purple-50/90 text-purple-800 border-purple-200/80",
  Conservation: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80",
  Festivals: "bg-rose-50/90 text-rose-800 border-rose-200/80",
  "Heritage Walks": "bg-teal-50/90 text-teal-800 border-teal-200/80",
  Exhibition: "bg-indigo-50/90 text-indigo-800 border-indigo-200/80",
  Seminar: "bg-sky-50/90 text-sky-800 border-sky-200/80",
  Workshop: "bg-orange-50/90 text-orange-800 border-orange-200/80",
  Training: "bg-cyan-50/90 text-cyan-800 border-cyan-200/80",
};

const livingHeritageCategoryMap = {
  "art-craft": { 
    label: "Art & Craft", 
    style: "bg-amber-50/90 text-amber-900 border-amber-200/90", 
    dot: "bg-amber-500" 
  },
  "art & craft": { 
    label: "Art & Craft", 
    style: "bg-amber-50/90 text-amber-900 border-amber-200/90", 
    dot: "bg-amber-500" 
  },
  "art and craft": { 
    label: "Art & Craft", 
    style: "bg-amber-50/90 text-amber-900 border-amber-200/90", 
    dot: "bg-amber-500" 
  },

  "festivals-rituals": { 
    label: "Festivals & Rituals", 
    style: "bg-rose-50/90 text-rose-900 border-rose-200/90", 
    dot: "bg-rose-500" 
  },
  "festivals & rituals": { 
    label: "Festivals & Rituals", 
    style: "bg-rose-50/90 text-rose-900 border-rose-200/90", 
    dot: "bg-rose-500" 
  },
  "festivals and rituals": { 
    label: "Festivals & Rituals", 
    style: "bg-rose-50/90 text-rose-900 border-rose-200/90", 
    dot: "bg-rose-500" 
  },

  "music": { 
    label: "Music", 
    style: "bg-purple-50/90 text-purple-900 border-purple-200/90", 
    dot: "bg-purple-500" 
  },

  "dance-theatre": { 
    label: "Dance & Theatre", 
    style: "bg-indigo-50/90 text-indigo-900 border-indigo-200/90", 
    dot: "bg-indigo-500" 
  },
  "dance & theatre": { 
    label: "Dance & Theatre", 
    style: "bg-indigo-50/90 text-indigo-900 border-indigo-200/90", 
    dot: "bg-indigo-500" 
  },
  "dance and theatre": { 
    label: "Dance & Theatre", 
    style: "bg-indigo-50/90 text-indigo-900 border-indigo-200/90", 
    dot: "bg-indigo-500" 
  },

  "oral-traditions": { 
    label: "Oral Traditions", 
    style: "bg-sky-50/90 text-sky-900 border-sky-200/90", 
    dot: "bg-sky-500" 
  },
  "oral traditions": { 
    label: "Oral Traditions", 
    style: "bg-sky-50/90 text-sky-900 border-sky-200/90", 
    dot: "bg-sky-500" 
  },

  "food-customs": { 
    label: "Food & Customs", 
    style: "bg-emerald-50/90 text-emerald-900 border-emerald-200/90", 
    dot: "bg-emerald-500" 
  },
  "food & customs": { 
    label: "Food & Customs", 
    style: "bg-emerald-50/90 text-emerald-900 border-emerald-200/90", 
    dot: "bg-emerald-500" 
  },
  "food and customs": { 
    label: "Food & Customs", 
    style: "bg-emerald-50/90 text-emerald-900 border-emerald-200/90", 
    dot: "bg-emerald-500" 
  },
};

const capitalizeCategory = (val) => {
  if (!val) return "General";
  const str = String(val).trim();

  const knownMap = {
    "art-craft": "Art & Craft",
    "art & craft": "Art & Craft",
    "art and craft": "Art & Craft",
    "festivals-rituals": "Festivals & Rituals",
    "festivals & rituals": "Festivals & Rituals",
    "festivals and rituals": "Festivals & Rituals",
    "music": "Music",
    "dance-theatre": "Dance & Theatre",
    "dance & theatre": "Dance & Theatre",
    "dance and theatre": "Dance & Theatre",
    "oral-traditions": "Oral Traditions",
    "oral traditions": "Oral Traditions",
    "food-customs": "Food & Customs",
    "food & customs": "Food & Customs",
    "food and customs": "Food & Customs",
  };

  const lower = str.toLowerCase();
  if (knownMap[lower]) return knownMap[lower];

  return str
    .replace(/-/g, ' ')
    .replace(/\band\b/gi, '&')
    .split(/\s+/)
    .map((word) => {
      if (word === "&") return "&";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const getCategoryDisplay = (val) => {
  if (!val) return { label: "General", style: "bg-[#F6F3EE] text-[#5A4E44] border-[#E7DED3]", dot: "bg-[#6F665E]" };
  const lower = String(val).toLowerCase().trim();
  const matched = livingHeritageCategoryMap[lower];
  const label = matched?.label || capitalizeCategory(val);
  return {
    label,
    style: matched?.style || categoryStyles[val] || "bg-[#F6F3EE] text-[#5A4E44] border-[#E7DED3]",
    dot: matched?.dot || "bg-[#B85C38]"
  };
};

const getAuthorityBadge = (managedBy) => {
  const code = String(managedBy || "state").toLowerCase();
  if (code === "unesco" || code.includes("unesco")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
        UNESCO Site
      </span>
    );
  }
  if (code === "central" || code.includes("asi")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        ASI Protected
      </span>
    );
  }
  if (code === "other" || code.includes("heritage")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
        Other Heritage Site
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
      State Protected
    </span>
  );
};

const getTypeBadge = (type) => {
  const code = String(type || "excavation").toLowerCase();
  if (code.includes("exploration")) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
        Exploration Activity
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      Excavation Site
    </span>
  );
};

/**
 * Reusable admin data table.
 *
 * Props:
 *   columns   — [{ key, label, type }]
 *              type: "text" | "image" | "badge" | "tags"
 *   data      — array of row objects
 *   showImage — boolean (default true; set false to hide image thumbnails)
 *   onEdit       — (row) => void
 *   onDelete     — (row) => void
 *   isRowLocked  — (row) => boolean; locked rows are read-only (bundled data
 *                  that has no database record to edit or delete)
 *   lockedHint   — tooltip shown on a locked row
 *   onView    — (row) => void  (optional)
 */
const AdminTable = ({
  columns = [],
  data = [],
  showImage = true,
  onEdit,
  onDelete,
  onView,
  isRowLocked = () => false,
  lockedHint = "This entry is read-only.",
}) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-[#E7DED3] text-center">
        <div className="w-10 h-10 rounded-md bg-[#FAF8F3] border border-[#E7DED3] flex items-center justify-center text-[#6F665E] mb-2.5">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-[#2F241D] text-sm mb-1 tracking-tight">No records found</h3>
        <p className="text-xs text-[#6F665E] max-w-sm">
          No records match your search criteria or category filter. Try clearing filters or creating a new post.
        </p>
      </div>
    );
  }

  const hasDedicatedImageCol = columns.some(
    (c) => c.type === "image" || c.key === "cover" || c.key === "image"
  );

  const renderCell = (row, col) => {
    const val = row[col.key];

    switch (col.type) {
      case "image": {
        if (!showImage) return <span className="text-xs text-[#6F665E]">—</span>;
        const resolvedImageCol = resolveTableImage(val || row.cover || row.image || row.coverImage || row.thumbnail);
        return resolvedImageCol ? (
          <img loading="lazy" decoding="async"
            src={resolvedImageCol}
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = NalandaImg;
            }}
            className="w-10 h-12 rounded-md object-cover border border-[#E7DED3]"
          />
        ) : (
          <div className="w-10 h-12 rounded-md bg-[#FAF8F3] border border-[#E7DED3] flex items-center justify-center text-[10px] text-[#6F665E]">
            —
          </div>
        );
      }

      case "badge":
        if (col.key === "managed_by") {
          return getAuthorityBadge(val);
        }
        if (col.key === "type") {
          return getTypeBadge(val);
        }
        if (col.key === "category") {
          const { label: catLabel, style, dot } = getCategoryDisplay(val);
          return (
            <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] border text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs ${style}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot || "bg-[#B85C38]"} shrink-0`} />
              <span>{catLabel}</span>
            </span>
          );
        }
        if (col.key === "status") {
          if (col.label === "Member Standing") {
            const displayStatus = val === "Inactive" || val === "Past / Inactive" ? "Inactive" : "Active";
            return <StatusBadge status={displayStatus} />;
          }
          const displayStatus = val === "Active" ? "Published" : (val || "Published");
          return <StatusBadge status={displayStatus} />;
        }
        return <StatusBadge status={val || "Draft"} />;

      case "tags":
        if (!val || !Array.isArray(val)) return <span className="text-xs text-[#6F665E]">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {val.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] rounded-md bg-[#FAF8F3] border border-[#E7DED3] text-[#6F665E] font-medium uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        );

      default:
        if (col.key === "title" || col.key === "name") {
          const rawImg = !hasDedicatedImageCol
            ? (row.coverImage || row.image || row.thumbnail || row.cover)
            : null;
          const img = resolveTableImage(rawImg);
          return (
            <div className="flex items-center gap-3">
              {showImage && !hasDedicatedImageCol && img && (
                <img loading="lazy" decoding="async"
                  src={img}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = NalandaImg;
                  }}
                  className="w-9 h-9 rounded-md object-cover border border-[#E7DED3] shrink-0"
                />
              )}
              <div className="min-w-0">
                <span
                  className={`text-sm font-semibold text-[#2F241D] leading-snug line-clamp-1 block ${
                    isRowLocked(row)
                      ? "cursor-default"
                      : "hover:text-[#B85C38] transition-colors cursor-pointer"
                  }`}
                  onClick={() => !isRowLocked(row) && onEdit(row)}
                >
                  {val || "Untitled"}
                </span>
              </div>
            </div>
          );
        }

        if (col.key === "category") {
          const { label: catLabel, style, dot } = getCategoryDisplay(val);
          return (
            <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] border text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs ${style}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dot || "bg-[#B85C38]"} shrink-0`} />
              <span>{catLabel}</span>
            </span>
          );
        }

        if (col.key === "origin") {
          return (
            <div className="max-w-xs" title={val}>
              <span className="text-xs text-[#6F665E] leading-relaxed line-clamp-2 block font-normal">
                {val || "—"}
              </span>
            </div>
          );
        }

        if (col.key === "district") {
          let dist = val;
          if (!dist || dist === "—" || dist === "Bihar") {
            const loc = row.location || "";
            const parts = loc.split(",").map((s) => s.trim()).filter(Boolean);
            if (parts.length >= 3) dist = parts[parts.length - 2];
            else if (parts.length === 2) dist = parts[0];
            else dist = parts[0] || "Patna";
          }
          return (
            <span className="text-sm text-[#2F241D] line-clamp-1 font-medium">
              {dist || "Patna"}
            </span>
          );
        }

        if (col.key === "author") {
          return (
            <div className="flex items-center gap-1.5 text-xs text-[#2F241D] font-medium">
              <div className="w-5 h-5 rounded-full bg-[#E7DED3]/60 flex items-center justify-center text-[10px] font-bold text-[#6F665E]">
                <User className="w-3 h-3 text-[#6F665E]" />
              </div>
              <span>{val || "Editor"}</span>
            </div>
          );
        }

        return (
          <span className="text-sm text-[#2F241D] line-clamp-1 font-medium">
            {val || "—"}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-[#E7DED3] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E7DED3] bg-[#FAF8F3]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-[11px] font-bold text-[#6F665E] uppercase tracking-wider whitespace-nowrap ${
                    col.key === "category" ? "min-w-[170px]" : col.key === "origin" ? "min-w-[160px]" : col.key === "title" ? "min-w-[200px]" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3 text-[11px] font-bold text-[#6F665E] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7DED3]/50">
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-[#FAF8F3]/60 transition-colors group"
              >
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-5 py-3.5 text-sm align-middle ${
                      col.key === "category" ? "min-w-[170px]" : col.key === "origin" ? "min-w-[160px]" : ""
                    }`}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
                <td className="px-5 py-3.5 align-middle text-right">
                  <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-1.5 rounded-md text-[#6F665E] hover:text-[#B85C38] hover:bg-[#B85C38]/10 transition cursor-pointer"
                        title="View Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isRowLocked(row) ? (
                      <span
                        className="p-1.5 rounded-md text-[#8C827A]/70 cursor-not-allowed"
                        title={lockedHint}
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-md text-[#6F665E] hover:text-[#B85C38] hover:bg-[#B85C38]/10 transition cursor-pointer"
                          title="Edit Record"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded-md text-[#6F665E] hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
