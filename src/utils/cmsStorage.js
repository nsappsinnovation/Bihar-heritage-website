/**
 * CMS localStorage Helper Utilities
 * 
 * These functions provide a unified interface for reading and writing
 * content data. Currently backed by localStorage, designed so that
 * swapping to API calls only requires changing this file.
 */

/**
 * True for an image the admin supplied (data/http URL or a server path).
 * Bundled assets are excluded: their URLs are hashed per build ("/assets/x-<hash>.webp")
 * or dev-only ("/src/..."), so a copy cached in localStorage goes stale after a deploy
 * and must be replaced by the current default instead of being kept as a "custom" image.
 */
const BUNDLED_IMAGE_PATH = /^\/(assets|src|@fs|node_modules)\//;
const isCustomImage = (image) =>
  typeof image === "string" &&
  (image.startsWith("data:") ||
    image.startsWith("http") ||
    (image.startsWith("/") && !BUNDLED_IMAGE_PATH.test(image)));

/**
 * Retrieve data from localStorage. If the key doesn't exist,
 * initialize it with defaultData and return that.
 */
export const getData = (storageKey, defaultData = []) => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Auto-migrate and normalize protected-sites dataset
      if (storageKey === "bh_protected_sites" && Array.isArray(parsed)) {
        let needsSave = false;

        // Clean out legacy duplicate state items (IDs 30 & 44 belong to 'other')
        let cleaned = parsed.filter(
          (item) => !(item.managed_by === "state" && (item.id === 30 || item.id === 44))
        );
        if (cleaned.length !== parsed.length) {
          needsSave = true;
        }

        // Sync state, central, unesco & other protected textual improvements from defaultData if present
        if (Array.isArray(defaultData)) {
          const defaultMap = new Map(defaultData.map((d) => [String(d.id), d]));
          cleaned = cleaned.map((item) => {
            const def = defaultMap.get(String(item.id));
            if (def) {
              if (
                !item.subtitle ||
                item.subtitle.startsWith('"') ||
                item.description !== def.description ||
                item.district !== def.district ||
                item.location !== def.location ||
                item.protected_since !== def.protected_since ||
                item.name !== def.name ||
                item.management_body !== def.management_body ||
                (def.image && item.image !== def.image)
              ) {
                needsSave = true;
                return {
                  ...item,
                  name: def.name || item.name,
                  location: def.location || item.location,
                  district: def.district || item.district,
                  locality: def.locality || item.locality,
                  sub_circle: def.sub_circle || item.sub_circle,
                  protected_since: def.protected_since || item.protected_since,
                  subtitle: def.subtitle || item.subtitle,
                  description: def.description || item.description,
                  management_body: def.management_body || item.management_body,
                  category: def.category || item.category,
                  image: def.image || item.image,
                  images: def.images || item.images,
                };
              }
            }
            return item;
          });
        }

        const normalized = cleaned.map((item) => {
          if (!item.district || item.district === "Bihar") {
            const loc = item.location || "";
            const parts = loc.split(",").map((s) => s.trim()).filter(Boolean);
            let dist = "Patna";
            if (parts.length >= 3) dist = parts[parts.length - 2];
            else if (parts.length === 2) dist = parts[0];
            else if (parts.length === 1) dist = parts[0];
            needsSave = true;
            return { ...item, district: dist };
          }
          return item;
        });

        const hasCentral = normalized.some((item) => item.managed_by === "central");
        const hasUnesco = normalized.some((item) => item.managed_by === "unesco");
        if (Array.isArray(defaultData) && (!hasCentral || !hasUnesco || normalized.length < 131)) {
          const existingIds = new Set(normalized.map((item) => String(item.id)));
          const missing = defaultData.filter((item) => !existingIds.has(String(item.id)));
          const merged = [...normalized, ...missing];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }

        if (needsSave) {
          localStorage.setItem(storageKey, JSON.stringify(normalized));
        }
        return normalized;
      }

      // Auto-migrate and normalize excavation-sites dataset
      if (storageKey === "bh_excavation_sites" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          // 1. Filter out corrupt, untitled, or cross-pollinated protected-site entries
          const cleaned = parsed.filter((item) => {
            if (!item) return false;
            const title = (item.title || item.name || "").trim();
            if (!title || title.toLowerCase() === "untitled") return false;
            // Purge cross-pollinated records with protected sites attributes
            if (item.managed_by && !item.type && !item.period && !item.lead_agency) {
              return false;
            }
            return true;
          });

          const defaultTitles = new Set(defaultData.map((d) => d.title.toLowerCase()));
          const defaultIds = new Set(defaultData.map((d) => String(d.id)));

          // 2. Map default items preserving any user edits
          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                String(p.id) === String(defItem.id) ||
                (p.title && p.title.toLowerCase() === defItem.title.toLowerCase()) ||
                (p.name && p.name.toLowerCase() === defItem.title.toLowerCase())
            );

            if (userItem) {
              const isValidCustomImg =
                isCustomImage(userItem.image);

              return {
                ...defItem,
                ...userItem,
                id: defItem.id,
                title: defItem.title,
                type: userItem.type || defItem.type,
                district: defItem.district || userItem.district,
                location: defItem.location || userItem.location,
                period: defItem.period || userItem.period,
                lead_agency: defItem.lead_agency || userItem.lead_agency,
                image: isValidCustomImg ? userItem.image : defItem.image,
                description: defItem.description || userItem.description,
                details: defItem.details || userItem.details,
                map_url: userItem.map_url !== undefined ? userItem.map_url : defItem.map_url,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          // 3. Keep any valid new custom projects created by the user
          const customNewItems = cleaned.filter(
            (p) =>
              p.title &&
              !defaultTitles.has(p.title.toLowerCase()) &&
              !defaultIds.has(String(p.id))
          );

          const merged = [...upgraded, ...customNewItems];

          // Always write back the cleaned and normalized dataset to localStorage
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize popular-sites dataset
      if (storageKey === "bh_popular_sites" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed.filter((item) => {
            if (!item) return false;
            const title = (item.title || item.name || "").trim();
            return title.length > 0 && title.toLowerCase() !== "untitled";
          });

          const defaultTitles = new Set(defaultData.map((d) => d.title.toLowerCase()));
          const defaultIds = new Set(defaultData.map((d) => String(d.id)));

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                String(p.id) === String(defItem.id) ||
                (p.title && p.title.toLowerCase() === defItem.title.toLowerCase())
            );

            if (userItem) {
              const isValidCustomImg =
                isCustomImage(userItem.image);

              return {
                ...defItem,
                ...userItem,
                id: defItem.id,
                title: defItem.title,
                location: defItem.location || userItem.location,
                subtitle: defItem.subtitle || userItem.subtitle,
                image: isValidCustomImg ? userItem.image : defItem.image,
                wikipedia: defItem.wikipedia || userItem.wikipedia,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const customNewItems = cleaned.filter(
            (p) =>
              p.title &&
              !defaultTitles.has(p.title.toLowerCase()) &&
              !defaultIds.has(String(p.id))
          );

          const merged = [...upgraded, ...customNewItems];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize workshops & activities dataset
      if (storageKey === "bh_workshops" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed.filter((item) => {
            if (!item) return false;
            const title = (item.title || item.name || "").trim();
            return title.length > 0 && title.toLowerCase() !== "untitled";
          });

          const defaultTitles = new Set(defaultData.map((d) => d.title.toLowerCase()));
          const defaultIds = new Set(defaultData.map((d) => String(d.id)));

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                String(p.id) === String(defItem.id) ||
                (p.title && p.title.toLowerCase() === defItem.title.toLowerCase())
            );

            if (userItem) {
              return {
                ...defItem,
                ...userItem,
                id: defItem.id,
                title: userItem.title || defItem.title,
                subtitle: userItem.subtitle || defItem.subtitle,
                date: userItem.date || defItem.date,
                category: userItem.category || defItem.category,
                location: userItem.location || defItem.location,
                district: userItem.district || defItem.district || "Patna",
                details: userItem.details || defItem.details,
                image: userItem.image || userItem.link || defItem.image,
                link: userItem.link || userItem.image || defItem.link,
                map_url: userItem.map_url !== undefined ? userItem.map_url : (defItem.map_url || ""),
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const customNewItems = cleaned.filter(
            (p) =>
              p.title &&
              !defaultTitles.has(p.title.toLowerCase()) &&
              !defaultIds.has(String(p.id))
          );

          const merged = [...upgraded, ...customNewItems];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize publications dataset
      if (storageKey === "bh_publications" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed.filter((item) => {
            if (!item) return false;
            const title = (item.title || item.name || "").trim();
            return title.length > 0 && title.toLowerCase() !== "untitled";
          });

          const defaultTitles = new Set(defaultData.map((d) => d.title.toLowerCase().trim()));

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                p.title &&
                p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim()
            );

            if (userItem) {
              const hasValidCover =
                userItem.cover &&
                typeof userItem.cover === "string" &&
                userItem.cover.trim() !== "";
              const hasValidPdf =
                userItem.pdfUrl &&
                typeof userItem.pdfUrl === "string" &&
                userItem.pdfUrl.trim() !== "";

              return {
                ...defItem,
                ...userItem,
                id: userItem.id || defItem.id,
                title: userItem.title || defItem.title,
                subtitle: userItem.subtitle || defItem.subtitle,
                category: userItem.category || defItem.category || "Research Publication",
                author: userItem.author || defItem.author,
                year: userItem.year || defItem.year,
                language: userItem.language || defItem.language,
                pages: userItem.pages || defItem.pages,
                description: userItem.description || defItem.description,
                cover: hasValidCover ? userItem.cover : defItem.cover,
                pdfUrl: hasValidPdf ? userItem.pdfUrl : defItem.pdfUrl,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const customNewItems = cleaned.filter(
            (p) =>
              p.title &&
              !defaultTitles.has(p.title.toLowerCase().trim())
          );

          const merged = [...customNewItems, ...upgraded];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize events dataset
      if (storageKey === "bh_events" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              ...item,
              title: (item.title || item.name || "").trim(),
              description: item.description || item.details || "",
              image: item.image || item.cover || item.coverImage || item.banner || "",
              category: item.category || "Cultural Festival",
              date: item.date || item.event_date || "",
              time: item.time || "10:00 AM - 05:00 PM",
              location: item.location || item.district || "Patna",
              district: item.district || "Patna",
              venue: item.venue || "",
              organizer: item.organizer || "Bihar Heritage Development Society (BHDS)",
              entryFee: item.entryFee || "Free Entry",
              highlights: item.highlights || "",
              status: item.status || "Published"
            }))
            .filter((item) => item.title.length > 0 && item.title.toLowerCase() !== "untitled");

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(defItem.id)) ||
                (p.title && p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim())
            );

            if (userItem) {
              const isValidCustomImg =
                isCustomImage(userItem.image);

              const tags = userItem.tagsString
                ? userItem.tagsString.split(",").map((t) => t.trim()).filter(Boolean)
                : Array.isArray(userItem.tags)
                  ? userItem.tags
                  : defItem.tags;

              return {
                ...defItem,
                ...userItem,
                id: userItem.id || defItem.id,
                title: userItem.title || defItem.title,
                category: userItem.category || defItem.category || "Cultural Festival",
                date: userItem.date || defItem.date,
                time: userItem.time || defItem.time || "10:00 AM - 05:00 PM",
                location: userItem.location || defItem.location,
                district: userItem.district || defItem.district,
                venue: userItem.venue || defItem.venue,
                organizer: userItem.organizer || defItem.organizer,
                entryFee: userItem.entryFee || defItem.entryFee || "Free Entry",
                image: isValidCustomImg ? userItem.image : defItem.image,
                description: userItem.description || defItem.description,
                highlights: userItem.highlights || defItem.highlights,
                tags,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const matchedIds = new Set(
            upgraded.map((u) => u && String(u.id)).filter(Boolean)
          );
          const matchedTitles = new Set(
            upgraded.map((u) => u && u.title && u.title.toLowerCase().trim()).filter(Boolean)
          );

          const customNewItems = cleaned.filter((p) => {
            if (!p) return false;
            const idMatch = p.id !== undefined && matchedIds.has(String(p.id));
            const titleMatch = p.title && matchedTitles.has(p.title.toLowerCase().trim());
            return !idMatch && !titleMatch;
          });

          const merged = [...customNewItems, ...upgraded];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize news dataset
      if (storageKey === "bh_news" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              ...item,
              title: (item.title || item.headline || item.name || "").trim(),
              description: item.description || item.content || item.summary || "",
              image: item.image || item.cover || item.banner || "",
              category: item.category || "Official Bulletin",
              date: item.date || item.publishedAt || "",
              author: item.author || "BHDS Editorial Team",
              source: item.source || "Bihar Heritage Development Society",
              status: item.status || "Published"
            }))
            .filter((item) => item.title.length > 0 && item.title.toLowerCase() !== "untitled");

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(defItem.id)) ||
                (p.title && p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim())
            );

            if (userItem) {
              const isValidCustomImg =
                isCustomImage(userItem.image);

              return {
                ...defItem,
                ...userItem,
                id: userItem.id || defItem.id,
                title: userItem.title || defItem.title,
                category: userItem.category || defItem.category || "Official Bulletin",
                date: userItem.date || defItem.date,
                image: isValidCustomImg ? userItem.image : defItem.image,
                description: userItem.description || defItem.description,
                author: userItem.author || defItem.author,
                source: userItem.source || defItem.source,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const matchedIds = new Set(
            upgraded.map((u) => u && String(u.id)).filter(Boolean)
          );
          const matchedTitles = new Set(
            upgraded.map((u) => u && u.title && u.title.toLowerCase().trim()).filter(Boolean)
          );

          const customNewItems = cleaned.filter((p) => {
            if (!p) return false;
            const idMatch = p.id !== undefined && matchedIds.has(String(p.id));
            const titleMatch = p.title && matchedTitles.has(p.title.toLowerCase().trim());
            return !idMatch && !titleMatch;
          });

          const merged = [...customNewItems, ...upgraded];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize photos gallery dataset
      if (storageKey === "bh_photos" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              ...item,
              title: (item.title || item.name || "").trim(),
              category: item.category || "Monuments",
              description: item.description || item.subtitle || "",
              location: item.location || "Bihar",
              wikipedia: item.wikipedia || "",
              image: item.image || item.cover || "",
              status: item.status || "Published"
            }))
            .filter((item) => item.title.length > 0 && item.title.toLowerCase() !== "untitled");

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(defItem.id)) ||
                (p.title && p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim())
            );

            if (userItem) {
              const isValidCustomImg =
                isCustomImage(userItem.image);

              return {
                ...defItem,
                ...userItem,
                id: userItem.id || defItem.id,
                title: userItem.title || defItem.title,
                category: userItem.category || defItem.category || "Monuments",
                location: userItem.location || defItem.location,
                description: userItem.description || defItem.description,
                wikipedia: userItem.wikipedia || defItem.wikipedia || "",
                image: isValidCustomImg ? userItem.image : defItem.image,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const matchedIds = new Set(
            upgraded.map((u) => u && String(u.id)).filter(Boolean)
          );
          const matchedTitles = new Set(
            upgraded.map((u) => u && u.title && u.title.toLowerCase().trim()).filter(Boolean)
          );

          const customNewItems = cleaned.filter((p) => {
            if (!p) return false;
            const idMatch = p.id !== undefined && matchedIds.has(String(p.id));
            const titleMatch = p.title && matchedTitles.has(p.title.toLowerCase().trim());
            return !idMatch && !titleMatch;
          });

          const merged = [...customNewItems, ...upgraded];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize video vault dataset
      if (storageKey === "bh_videos" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => {
              let ytId = item.youtubeId || item.youtube_id || item.video_id || "";
              if (!ytId && typeof item.youtubeUrl === "string") {
                const match = item.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
                if (match) ytId = match[1];
              }
              if (!ytId && typeof item.id === "string" && item.id.length === 11) {
                ytId = item.id;
              }

              return {
                ...item,
                title: (item.title || item.name || "").trim(),
                category: item.category || "Documentary",
                duration: item.duration || "15:00",
                description: item.description || item.subtitle || "",
                region: item.region || "Bihar",
                youtubeId: ytId,
                thumbnail:
                  item.thumbnail ||
                  (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""),
                status: item.status || "Published"
              };
            })
            .filter((item) => item.title.length > 0 && item.title.toLowerCase() !== "untitled");

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(defItem.id)) ||
                (p.youtubeId && p.youtubeId === defItem.youtubeId) ||
                (p.title && p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim())
            );

            if (userItem) {
              return {
                ...defItem,
                ...userItem,
                id: userItem.id || defItem.id,
                title: userItem.title || defItem.title,
                category: userItem.category || defItem.category || "Documentary",
                duration: userItem.duration || defItem.duration,
                description: userItem.description || defItem.description,
                region: userItem.region || defItem.region || "Bihar",
                youtubeId: userItem.youtubeId || defItem.youtubeId,
                thumbnail: userItem.thumbnail || defItem.thumbnail,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const matchedIds = new Set(
            upgraded.map((u) => u && String(u.id)).filter(Boolean)
          );
          const matchedTitles = new Set(
            upgraded.map((u) => u && u.title && u.title.toLowerCase().trim()).filter(Boolean)
          );
          const matchedYtIds = new Set(
            upgraded.map((u) => u && u.youtubeId).filter(Boolean)
          );

          const customNewItems = cleaned.filter((p) => {
            if (!p) return false;
            const idMatch = p.id !== undefined && matchedIds.has(String(p.id));
            const titleMatch = p.title && matchedTitles.has(p.title.toLowerCase().trim());
            const ytMatch = p.youtubeId && matchedYtIds.has(p.youtubeId);
            return !idMatch && !titleMatch && !ytMatch;
          });

          const merged = [...customNewItems, ...upgraded];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and normalize heritage archives dataset
      if (storageKey === "bh_heritage_archives" && Array.isArray(parsed)) {
        if (Array.isArray(defaultData) && defaultData.length > 0) {
          const cleaned = parsed.filter((item) => item && typeof item === "object");
          const defaultTitles = new Set(defaultData.map((d) => d.title.toLowerCase().trim()));
          const defaultIds = new Set(defaultData.map((d) => String(d.id)));

          const upgraded = defaultData.map((defItem) => {
            const userItem = cleaned.find(
              (p) =>
                (p.id !== undefined && String(p.id) === String(defItem.id)) ||
                (p.title && p.title.toLowerCase().trim() === defItem.title.toLowerCase().trim()) ||
                (defItem.id === 7 && p.title && p.title.toLowerCase().includes("patna sahib"))
            );

            if (userItem) {
              return {
                ...defItem,
                ...userItem,
                id: defItem.id,
                title: defItem.title,
                category: userItem.category || defItem.category,
                location: defItem.location,
                description: defItem.description,
                year: defItem.year,
                significance: defItem.significance,
                link: defItem.link,
                image: defItem.image || userItem.image,
                status: userItem.status || "Published"
              };
            }
            return defItem;
          });

          const customNewItems = cleaned.filter((p) => {
            if (!p) return false;
            const idMatch = p.id !== undefined && defaultIds.has(String(p.id));
            const titleMatch = p.title && defaultTitles.has(p.title.toLowerCase().trim());
            const patnaMatch = p.title && p.title.toLowerCase().includes("patna sahib");
            return !idMatch && !titleMatch && !patnaMatch;
          });

          const merged = [...upgraded, ...customNewItems];
          localStorage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }

      // Auto-migrate and heal Organization & Showcase datasets if empty or outdated
      if (
        (storageKey === "bh_governing_body" ||
          storageKey === "bh_executive_committee" ||
          storageKey === "bh_key_functionaries" ||
          storageKey === "bh_archeological_team" ||
          storageKey === "bh_organization" ||
          storageKey === "bh_popular_sites" ||
          storageKey === "bh_news")
      ) {
        if (!Array.isArray(parsed) || parsed.length === 0) {
          if (Array.isArray(defaultData) && defaultData.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(defaultData));
            return defaultData;
          }
        } else {
          // Auto-migrate "Art, Culture & Youth Department" to "Art, Culture Department"
          let migrated = false;
          const updated = parsed.map((item) => {
            if (!item) return item;
            let newItem = { ...item };
            if (typeof newItem.department === "string" && newItem.department.includes("Art, Culture & Youth")) {
              newItem.department = newItem.department.replace(/Art,\s*Culture\s*&\s*Youth/g, "Art, Culture");
              migrated = true;
            }
            if (typeof newItem.position === "string" && newItem.position.includes("Art, Culture & Youth")) {
              newItem.position = newItem.position.replace(/Art,\s*Culture\s*&\s*Youth/g, "Art, Culture");
              migrated = true;
            }
            if (typeof newItem.name === "string" && newItem.name.includes("Art, Culture & Youth")) {
              newItem.name = newItem.name.replace(/Art,\s*Culture\s*&\s*Youth/g, "Art, Culture");
              migrated = true;
            }
            if (typeof newItem.source === "string" && newItem.source.includes("Art, Culture & Youth")) {
              newItem.source = newItem.source.replace(/Art,\s*Culture\s*&\s*Youth/g, "Art, Culture");
              migrated = true;
            }
            return newItem;
          });
          if (migrated) {
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
          }
        }
        return parsed;
      }

      return parsed;
    }
    // Initialize localStorage with defaults
    if (defaultData !== null && defaultData !== undefined) {
      localStorage.setItem(storageKey, JSON.stringify(defaultData));
    }
    return defaultData;
  } catch (e) {
    console.error(`[CMS] Error reading ${storageKey}:`, e);
    return defaultData;
  }
};

/**
 * Save updated data array to localStorage and notify all listeners.
 */
export const saveData = (storageKey, data) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("bh_cms_update"));
      window.dispatchEvent(new CustomEvent("bh_storage_update", { detail: { storageKey } }));
      // Pages that only listen for the native "storage" event (which
      // never fires in the tab that wrote the value) refresh off this.
      window.dispatchEvent(new Event("storage"));
    }
    return true;
  } catch (e) {
    console.warn(`[CMS] Storage save failed for ${storageKey} (Quota exceeded). Applying quota recovery...`, e);
    try {
      if (Array.isArray(data)) {
        // Strip oversized legacy raw base64 (> 120KB) to guarantee item retention and prevent data loss
        const sanitized = data.map((item) => {
          if (!item || typeof item !== "object") return item;
          const cleaned = { ...item };
          if (typeof cleaned.image === "string" && cleaned.image.startsWith("data:") && cleaned.image.length > 120000) {
            cleaned.image = "";
          }
          if (typeof cleaned.cover === "string" && cleaned.cover.startsWith("data:") && cleaned.cover.length > 120000) {
            cleaned.cover = "";
          }
          return cleaned;
        });

        localStorage.setItem(storageKey, JSON.stringify(sanitized));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("bh_cms_update"));
          window.dispatchEvent(new CustomEvent("bh_storage_update", { detail: { storageKey } }));
          // Pages that only listen for the native "storage" event (which
          // never fires in the tab that wrote the value) refresh off this.
          window.dispatchEvent(new Event("storage"));
        }
        return true;
      }
    } catch (fallbackErr) {
      console.error(`[CMS] Critical: Retry save failed for ${storageKey}:`, fallbackErr);
    }
    return false;
  }
};

/**
 * Append a new item. Automatically assigns a unique numeric ID.
 */
export const addItem = (storageKey, item, defaultData = []) => {
  const data = getData(storageKey, defaultData);
  const maxId = data.reduce((max, d) => Math.max(max, Number(d.id) || 0), 100);
  const newItem = { ...item, id: maxId + 1 };
  const updated = [newItem, ...data];
  saveData(storageKey, updated);
  return { data: updated, newItem };
};

/**
 * Update an existing item by its id.
 */
export const updateItem = (storageKey, id, updates, defaultData = []) => {
  const data = getData(storageKey, defaultData);
  const updated = data.map((item) =>
    String(item.id) === String(id) ? { ...item, ...updates } : item
  );
  saveData(storageKey, updated);
  return updated;
};

/**
 * Delete an item by its id.
 */
export const deleteItem = (storageKey, id, defaultData = []) => {
  const data = getData(storageKey, defaultData);
  const updated = data.filter((item) => String(item.id) !== String(id));
  saveData(storageKey, updated);
  return updated;
};

/**
 * Storage keys for each CMS module.
 */
export const STORAGE_KEYS = {
  GOVERNING_BODY: "bh_governing_body",
  EXECUTIVE_COMMITTEE: "bh_executive_committee",
  KEY_FUNCTIONARIES: "bh_key_functionaries",
  ARCHAEOLOGICAL_TEAM: "bh_archeological_team",
  ORGANIZATION: "bh_organization",
  HERITAGE_ARCHIVES: "bh_heritage_archives",
  POPULAR_SITES: "bh_popular_sites",
  LIVING_HERITAGE_VIDEOS: "bh_living_heritage_videos",
  HERITAGE_VIDEOS: "bh_living_heritage_videos",
  SHOWCASE: "bh_heritage_archives",
  PROTECTED_SITES: "bh_protected_sites",
  EXCAVATION: "bh_excavation_sites",
  WORKSHOPS: "bh_workshops",
  PUBLICATIONS: "bh_publications",
  EVENTS: "bh_events",
  NEWS: "bh_news",
  PHOTOS: "bh_photos",
  VIDEOS: "bh_videos",
  BLOGS: "bh_blogs",
  TANGIBLE_HERITAGE: "bh_tangible_heritage",
  INTANGIBLE_HERITAGE: "bh_tangible_heritage",
};
