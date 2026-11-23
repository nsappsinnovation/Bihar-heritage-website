# Bihar Heritage Atlas — Architecture Reference

Technical documentation for the interactive map section on the home page.

| | |
|---|---|
| **Component** | `src/sections/home/BiharHeritageMaps.jsx` (705 lines) |
| **Mounted at** | `src/pages/Home.jsx:6` (import), `:71` (render) — the only mount site |
| **Position on page** | Between `<LivingHeritage />` and `<Gallery />`, inside the `ReactLenis` smooth-scroll root |
| **Props** | None. Single default-exported function component. |
| **Rendering technology** | Hand-rolled inline `<svg>` — **not Leaflet** (see below) |
| **Data source** | 5 static JSON files imported at build time. No API, no localStorage. |

---

## 1. Read this first: it is not a Leaflet map

`package.json` declares `leaflet@^1.9.4` and `react-leaflet@^5.0.0`, and
`src/index.css:3` imports `leaflet/dist/leaflet.css` globally. **None of it is used.**
A grep across `src/` returns zero occurrences of `MapContainer`, `TileLayer`, `Marker`,
`Popup`, `useMap`, or any `import … from "leaflet"`.

The Atlas is an **inline SVG choropleth**. It reads a real GeoJSON file of Bihar's district
boundaries and converts each polygon into an SVG `<path>` string using its own
equirectangular projection defined in six lines at the top of the file. Consequences worth
knowing:

- **No tile server and no network request** for map imagery. The map renders offline.
- **No pan and no zoom.** The `viewBox` is fixed at `0 0 800 620`.
- Interaction is ordinary React event handling on SVG elements, not a map-library API.
  There is no imperative map handle — the component contains no `useRef`.

Two other places still carry defensive code for a Leaflet map that no longer exists:
`src/context/ImageLightboxContext.jsx:86-90` (skips `.leaflet-tile`,
`.leaflet-marker-icon`, `.leaflet-container`) and `src/index.css:878` (excludes the same
classes from the lightbox `cursor: zoom-in` rule).

---

## 2. Data flow

```
  ┌─ build time ─────────────────────────────────────────────────────────────┐
  │                                                                          │
  │  src/data/bihar_districts.json      ─┐                                   │
  │  src/data/biharHeritageSites.json    │                                   │
  │  src/data/culturalZones.json         ├── static ES imports (lines 6–11)  │
  │  src/data/historicalRegions.json     │                                   │
  │  src/data/heritageCircuits.json     ─┘                                   │
  └──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                        BiharHeritageMaps.jsx
                                   │
     ┌─────────────────────────────┼─────────────────────────────┐
     ▼                             ▼                             ▼
  bihar_districts            biharHeritageSites          culturalZones /
  .features[]                [district].sites[]          historicalRegions /
     │                             │                     heritageCircuits
     │ project(lon,lat)            │ project(lng,lat)            │
     ▼                             ▼                             │ .districts[]
  districtPaths                site markers                      ▼
  38 × { name, id,            68 sites × { x, y,          highlight set
         path, centroid }              title … }          (district NAMES)
     │                             │                             │
     └─────────────────────────────┴─────────────────────────────┘
                                   │
                                   ▼
                    <svg viewBox="0 0 800 620">
                      <path> × 38  →  <circle> markers  →  <text> labels
```

### The architecturally significant point

**The Atlas never touches `cmsStorage.js`, `localStorage`, or the backend API.** There is no
`getData()` call, no storage key, and no `fetch`/`axios` anywhere in the file. Its entire
data surface is the five `import` statements.

This makes it **immune to `syncAll()` and to every CMS edit**. Publishing a protected site,
an excavation, or a heritage record in the admin panel changes nothing on this map. Unlike
the rest of the app — which resolves data through a
`localStorage → bundled seed → hardcoded fallback` chain — here the bundled JSON *is* the
only layer. **Changing what the Atlas shows means editing the JSON files in `src/data/` and
redeploying.**

---

## 3. UI sections, in render order

| # | Section | Lines | Notes |
|---|---|---|---|
| 1 | `<section>` wrapper | 189–192 | Parchment `#E4D6BC`, top/bottom borders `#E8DFC8/60` |
| 2 | Parchment wash overlay | 193–194 | `#F8F5F0` at 55% opacity, `pointer-events-none` |
| 3 | Dot-grid overlay | 196–198 | 32px radial-dot pattern at 0.035 opacity |
| 4 | Header | 200–211 | "Interactive Map" eyebrow → `<h2>` "Bihar Heritage Atlas" → subtitle |
| 5 | Classification tabs | 213–234 | 4 pills in a scrollable rail; `label` on `md+`, `short` below |
| 6 | Legend pills | 236–266 | **Toggle filters, not a legend.** Rendered only when `activeTab !== "district"` |
| 7 | Main two-column flex | 268–270 | `flex-col lg:flex-row`, `max-w-[1500px]` |
| 8 | LEFT 62% — the SVG map | 272–435 | See §4 |
| 9 | Floating hover tooltip | 419–432 | Absolutely positioned pill, edge-clamped |
| 10 | RIGHT 38% — info panel | 437–692 | `minHeight: 520px`, gradient accent ribbon, 4 exclusive views |
| 11 | Inline `<style>` | 695–700 | `.atlas-scroll` webkit scrollbar theming |

**What the section does *not* have:** no modal, no search input, no text filter, and no
zoom / recenter / reset-view controls.

### 3.1 The four tabs

Defined at lines 22–27:

| `id` | `label` (desktop) | `short` (mobile) |
|---|---|---|
| `district` | Explore Districts | Districts |
| `cultural` | Cultural Zones | Cultural |
| `historical` | Historical Regions | Historical |
| `circuit` | Heritage Circuits | Circuits |

`district` is the default. Switching tabs clears the selection via the effect at line 52.

### 3.2 The map panel (left column)

Inside `<svg viewBox="0 0 800 620">` (line 278), in paint order:

1. **`<defs>`** — a `feDropShadow` filter, `id="sel-shadow"` (280–283).
2. **38 district `<path>` elements** (285–308) — each carries the hover/click handlers and
   is styled by `getDistrictStyle(name)`.
3. **Heritage-site markers** (310–319) — district tab only. Plain SVG: a pulsing `r=8`
   outer ring (`#B8844A`, 25% opacity) plus an `r=5` filled dot with a `#FFFDF9` stroke,
   wrapped in `motion.g` with a staggered `delay: i * 0.03`. The only label is a native
   SVG `<title>` tooltip — there is no popup component.
4. **Highlighted-district labels** (321–370) — non-district tabs only, for districts in the
   selected item's set. Drawn twice: a white 3px stroke halo underneath, then the item's
   accent colour on top. Names longer than **12** characters are truncated to their first word.
5. **All-district labels** (372–416) — district tab only, for every district except the
   selected one. Same halo technique; truncation threshold is **10** characters here.
   The hovered district's label grows 7.5px → 9.5px and recolours to `#C56A3D`.

### 3.3 The info panel (right column)

One `<AnimatePresence mode="wait">` holding four mutually exclusive branches. The guard
conditions matter, because "nothing selected" and "wrong tab" are separate cases:

| Branch | Guard | Line |
|---|---|---|
| **A** District selected | `activeTab === "district" && selected && selectedDistrictData` | 447 |
| **B** District tab, idle | `activeTab === "district" && !selected` | 510 |
| **C** Zone/region/circuit selected | `activeTab !== "district" && selectedItem` | 550 |
| **D** Non-district tab, idle | `activeTab !== "district" && !selectedItem` | 645 |

**Branch A — district profile.** "District Profile" eyebrow, district name, an `{n} Sites`
badge, a close `X`. Then the district `summary` in an italic tinted box, a scrollable list
of site cards (60×60 thumbnail with an `onError` that hides its wrapper, title, category
badge, description), and a footer with "← Clear" plus a link to `/protected-sites`.

**Branch B — district tab default.** `Compass` icon header "Explore by District / Click any
district on the map", a 2×2 stats grid (see §6, defect 2), an explanatory paragraph, and a
pill link "View All Protected Sites".

**Branch C — item detail.** Accent-coloured tab label, item `label`, `era`, `tagline`,
close `X`, `description` box. Then a scrollable body containing:
- an **Art Forms** chip cloud — cultural tab only (579–588);
- a **unified card list** over `selectedItem.highlights || important_sites || stops`
  (591–614). One renderer serves all three datasets: a numbered badge appears only for
  circuit stops with an `order`, the badge text is `item.period || item.type`, and the body
  text is `item.description || item.significance`;
- **circuit metadata** — `circuit_length_km` and `best_time` in a 2-up grid (617–632).

**Branch D — item list.** `Layers` icon header, then one clickable button per dataset entry
showing a colour dot, `label`, `era` or `{km} km`, `tagline`, and a
`{n} stops|districts` count with a hover-revealed chevron.

---

## 4. How the map is drawn

### 4.1 The projection (lines 14–19)

```js
const minLon = 83.316, maxLon = 88.292, minLat = 24.287, maxLat = 27.524;
const W = 800, H = 620, PAD = 20;
const project = (lon, lat) => ({
  x: PAD + ((lon - minLon) / (maxLon - minLon)) * (W - 2 * PAD),
  y: PAD + ((maxLat - lat) / (maxLat - minLat)) * (H - 2 * PAD),
});
```

A naive equirectangular stretch: longitude maps linearly to `x`, latitude maps linearly and
inverted to `y`. There is no `cos(latitude)` correction, so Bihar is horizontally distorted
relative to a true projection. `W`/`H` must stay in sync with the `viewBox` at line 278.

The bounding box is the GeoJSON's own extent (`83.31607 → 88.291915`,
`24.2868049 → 27.524491`) rounded and **hardcoded** rather than computed — see §6, defect 4.

### 4.2 Geometry pipeline — the `districtPaths` memo (lines 55–90)

Runs once (`[]` dependencies) and produces 38 objects of `{ name, id, path, centroid }`:

- **`ringToPath(ring)`** — emits `"M x y L x y … Z"` at one decimal place.
- **`Polygon`** — all rings joined; centroid from `coordinates[0]` (the exterior ring).
- **`MultiPolygon`** — every ring of every polygon joined; the centroid comes from the
  polygon whose exterior ring has the **most points**, used as a proxy for "largest"
  (line 85). Only one of the 38 features is a `MultiPolygon`.
- **`ringCentroid(ring)`** — the unweighted **mean of the projected vertices**, not a true
  area-weighted centroid. It is only used to place text labels, so the approximation is
  cosmetic, but it will sit off-centre on concave or elongated districts.

`name` comes from `properties.Dist_Name` and `id` from `properties.Dist_Code`; the other
four GeoJSON properties are ignored.

### 4.3 Fill and stroke — `getDistrictStyle(name)` (lines 135–164)

Six branches, evaluated in order:

| Condition | Fill | Stroke | Width |
|---|---|---|---|
| Selected district (district tab) | `#F4E4C1` | `#9A6535` | 2.2 + drop shadow |
| Hovered (district tab) | `#FFF3E0` | `#C56A3D` | 1.2 |
| District tab, otherwise | `#FFFFFF` | `#C8A882` | 0.7 |
| In the selected item's district set | `rgba(accent, 0.55)` | item colour | 2 + drop shadow |
| Non-district tab with a selection, not in the set | `#E1D5C5` | `#AFA08C` | 0.8 |
| Non-district tab, no selection | `#FFFFFF` | `#C8A882` | 0.7 |

The accent colour is `selectedItemMeta.color`, defaulting to `#C56A3D`.

### 4.4 Paint order — `sortedPaths` (lines 167–172)

SVG has no `z-index`, so the selected district is moved to the **end** of the array to draw
last, keeping its heavier stroke and drop shadow from being clipped by neighbours.

---

## 5. State, memos and interactions

### 5.1 State (lines 39–43)

| State | Type | What it drives |
|---|---|---|
| `activeTab` | `"district"｜"cultural"｜"historical"｜"circuit"` | Tabs, legend visibility, map colouring, which panel branch renders |
| `selected` | `string ｜ null` | **Dual-typed** — see the warning below |
| `hoveredDistrict` | `string ｜ null` | Hover fill + label emphasis + the floating tooltip. Only honoured on the district tab |
| `tooltipPos` | `{ x, y }` | Cursor position relative to the left column |
| `isMobile` | `boolean` | **Nothing — dead state.** Set on mount and resize, never read |

> **`selected` is dual-typed.** On the district tab it holds a **district name**
> (`"Nalanda"`); on the other three tabs it holds an **item id** (`"buddhist_circuit"`).
> This is the single most confusing thing in the file — the same variable is keyed against
> two different vocabularies depending on `activeTab`, which is why almost every derived
> value is guarded by an `activeTab === "district"` check.

### 5.2 Effects and memos

| Line | What |
|---|---|
| 45–49 | `resize` listener maintaining `isMobile` (with cleanup) |
| 52 | Clears `selected` and `hoveredDistrict` whenever `activeTab` changes |
| 55–90 | `districtPaths` — the geometry pipeline (§4.2) |
| 93–105 | `selectedItemMeta` — `{ color, districts }` for the selected item; falls back to `item.stops.map(s => s.district)` when there is no `districts` array |
| 114–119 | `selectedDistrictMarkers` — district-tab sites, filtered to those with `coordinates`, spread with projected `{ x, y }` |
| 167–172 | `sortedPaths` (§4.4) |
| 181–185 | `totalSites` — sums `sites.length` across all districts → **68** |

Per-render (not memoised): `districtColorMap` (108, a dead empty object),
`selectedDistricts` (111), and `panelDatasets` / `currentPanelItems` / `selectedItem` /
`selectedDistrictData` (175–178).

Callbacks: `handleMouseMove` (122–125, `getBoundingClientRect`-relative) and
`handleDistrictClick` (127–132, toggle-select, district tab only).

### 5.3 Interactions

| Action | Effect | Line |
|---|---|---|
| Click a tab | Switch classification; clears selection | 221 |
| Click a legend pill | Toggle that item; highlights its districts and opens branch C | 250 |
| Hover a district | Sets `hoveredDistrict` — **district tab only**, and never for the already-selected district | 300–303 |
| Click a district | Toggle-select — **a no-op on the three non-district tabs** | 304 |
| Move the mouse over the left column | Repositions the tooltip | 275 |
| Leave the left column | Clears the hover | 276 |
| Hover a site marker | Native SVG `<title>` shows the site title | 316 |
| Click a panel list item | Selects that item (equivalent to the legend pill) | 663 |
| Click `X` / "← Clear" / "← Back" | `setSelected(null)` | 458, 501, 563, 636 |

The tooltip is clamped to stay inside the map: it flips to a `-130px` offset once
`tooltipPos.x > 480`, and is bounded to `left ≤ 650` / `top ≤ 560` (line 426).

Site thumbnails in branch A are also click-to-zoom, but not by this component's doing — the
app-wide interceptor in `src/context/ImageLightboxContext.jsx:75-108` opens the lightbox for
any `<img>` larger than 28×28px.

**Outbound navigation:** three react-router `<Link>`s, all pointing at `/protected-sites`
(lines 502, 542, 637). No external links, no Google Maps links, no directions.

---

## 6. Where the data resides

All five files live in `src/data/`. None of them is reachable from the admin CMS.

| File | Shape | Size |
|---|---|---|
| `bihar_districts.json` | GeoJSON `FeatureCollection`, CRS84 | 38 features (37 `Polygon`, 1 `MultiPolygon`), ~872KB |
| `biharHeritageSites.json` | Object keyed by district name | 38 keys, 68 sites |
| `culturalZones.json` | Array | 5 zones |
| `historicalRegions.json` | Array | 5 regions |
| `heritageCircuits.json` | Array | 5 circuits |

### 6.1 `bihar_districts.json` — the only real geography

`crs.properties.name` is `urn:ogc:def:crs:OGC:1.3:CRS84`, so coordinates are WGS84
`[lon, lat]` pairs. Feature `properties` are `REMARKS_2`, `Country`, `State_Name`,
`State_Code`, `Dist_Name`, `Dist_Code` — only the last two are read.

**This file is the canonical district vocabulary.** Every other dataset joins to the map by
exact string match against `Dist_Name`, so any new data must use these 38 spellings verbatim:

```
Araria              Arwal               Aurangabad          Banka
Begusarai           Bhagalpur           Bhojpur             Buxar
Darbhanga           Gaya                Gopalganj           Jamui
Jehanabad           Kaimur (Bhabua)     Katihar             Khagaria
Kishanganj          Lakhisarai          Madhepura           Madhubani
Munger              Muzaffarpur         Nalanda             Nawada
Pashchim Champaran  Patna               Purba Champaran     Purnia
Rohtas              Saharsa             Samastipur          Saran
Sheikhpura          Sheohar             Sitamarhi           Siwan
Supaul              Vaishali
```

Note the non-obvious ones: `Kaimur (Bhabua)` carries its parenthetical, and the Champarans
are `Purba` / `Pashchim`, not `East` / `West`.

### 6.2 `biharHeritageSites.json` — sites with real coordinates

A **top-level object keyed by district name**, not an array. Its 38 keys match the GeoJSON
set exactly, in both directions. Each value is `{ summary, sites[] }`; all 38 have a
non-empty summary, and all 68 sites have coordinates.

Site fields: `title`, `category`, `description`, `image` (absolute external URL),
`coordinates: { lat, lng }`.

```json
"Patna": {
  "summary": "Historically known as Pataliputra, Patna was the imperial capital of the Mauryan, Shunga, and Gupta empires…",
  "sites": [
    {
      "title": "Kumhrar (80-Pillared Hall)",
      "category": "Ancient Ruins",
      "description": "The archaeological site displaying the ruins of the legendary 80-pillared audience hall…",
      "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kumhrar%20-%20Patna%20%281%29.jpg",
      "coordinates": { "lat": 25.6017, "lng": 85.1783 }
    }
  ]
}
```

This is the **only** dataset in the Atlas with numeric coordinates, and the only one that
produces markers.

### 6.3 The three classification datasets

None of these carry coordinates. They highlight districts purely by name.

**`culturalZones.json`** — ids `mithila`, `bhojpur`, `magadh`, `anga`, `bajjika`.
Fields: `id`, `label`, `color`, `tagline`, `description`, `districts`, `highlights`,
`keyFestivals`, `heritage_language`, `art_forms`. `highlights[]` entries are
`{ title, type, description, image, image_type, image_note }`.

**`historicalRegions.json`** — ids `magadha_kingdom`, `vajji_republic`, `anga_kingdom`,
`mithila_kingdom`, `sher_shah_era`. Fields: `id`, `label`, `color`, `era`, `tagline`,
`description`, `districts`, `important_sites`, `key_rulers`, `legacy`.
`important_sites[]` entries are `{ title, period, significance }`.

**`heritageCircuits.json`** — ids `buddhist_circuit`, `jain_circuit`, `sufi_circuit`,
`ramayana_circuit`, `nature_circuit`. Fields: `id`, `label`, `color`, `icon`, `tagline`,
`description`, `districts`, `stops`, `best_time`, `circuit_length_km`, `significance`.
`stops[]` entries are `{ order, title, district, description, type }`.

### 6.4 Resolution chain per tab

**District tab.** `Dist_Name` drives the shapes and labels. On click,
`districtData[selected]` is an **exact string key lookup**; its `.sites[]` are filtered to
those with `coordinates` and projected into markers. If a district name had no key in
`biharHeritageSites.json`, the marker list would be empty and branch A would not render —
**there is no fallback**. All 38 keys are present today, so this cannot currently happen.

**Cultural / Historical / Circuit tabs.** `datasets[activeTab].find(i => i.id === selected)`
(line 101), then `item.districts || item.stops?.map(s => s.district) || []` (line 103).
`districts` wins; because all three datasets always define it, the `stops` fallback is
**never** reached in practice. Highlighting is the plain string test
`selectedDistricts.includes(name)` (lines 139, 324).

---

## 7. Known issues

All verified against the current code and data.

1. **`"Rajgir"` never highlights.** `heritageCircuits.json → buddhist_circuit.districts`
   contains `"Rajgir"`, which is a town in Nalanda district, not a Bihar district, and is
   absent from the GeoJSON. It fails the `includes(name)` test silently. The same circuit's
   `stops[]` correctly files Rajgir under `Nalanda`, but §6.4 explains why `districts` takes
   precedence, so the correct value is never consulted. This is the only mismatch across all
   three classification datasets — `culturalZones.json` and `historicalRegions.json` are clean.

2. **The heritage-site count has a stale fallback.** Line 526 reads
   `{ value: totalSites || "81", label: "Heritage Sites" }`, but the computed `totalSites`
   is **68**. Because `totalSites` is always truthy the `"81"` never displays, so the UI is
   correct — but any copy elsewhere in the project quoting "81 heritage sites" is wrong.

3. **Three of the four stat tiles are hardcoded strings** (lines 524–528): `"38"` districts,
   `"5"` cultural zones, `"2"` UNESCO sites. Only "Heritage Sites" is derived from the data.
   `"38"` and `"5"` happen to match today; nothing keeps them in sync.

4. **The projection bbox is copied, not computed** (line 14). The four literals are rounded
   copies of the GeoJSON's real extent, so they align by construction today. Replacing
   `bihar_districts.json` with a differently-extended file will misregister every path and
   marker **with no error** — the map will simply be wrong. Deriving the bbox from
   `biharGeoJson.features` inside the existing `districtPaths` memo would remove the hazard.

5. **Dead code:** the `Route` import (line 4), the `isMobile` state (43, set and never
   read), `districtColorMap = {}` (108, whose own comment says it is unused), and
   `heritageCircuits`' `icon` and `significance` fields, which are never rendered.

6. **The dataset map is duplicated three times** — lines 95–100, 175, and 240–245. Two of
   the three have a suspicious blank line where a fourth entry would go (98 and 243),
   suggesting a removed fifth tab. A single module-level constant would collapse all three.

7. **Leaflet ships unused.** `leaflet` + `react-leaflet` are bundled dependencies and
   `leaflet.css` is imported globally, for zero benefit. See §1.

---

## 8. File reference

| Path | Role |
|---|---|
| `src/sections/home/BiharHeritageMaps.jsx` | The component. 705 lines, no props. |
| `src/pages/Home.jsx:6,71` | The only place it is mounted. |
| `src/data/bihar_districts.json` | District boundaries (GeoJSON). The canonical district vocabulary. |
| `src/data/biharHeritageSites.json` | Per-district summaries + 68 sites with lat/lng. |
| `src/data/culturalZones.json` | 5 cultural zones. |
| `src/data/historicalRegions.json` | 5 historical regions. |
| `src/data/heritageCircuits.json` | 5 pilgrimage/tourism circuits. |
| `src/index.css:3` | Global (unused) Leaflet CSS import. |
| `src/index.css:878` | Lightbox `cursor: zoom-in` rule with `.leaflet-*` exclusions. |
| `src/context/ImageLightboxContext.jsx:75-108` | App-wide click-to-zoom that also catches the panel's site thumbnails. |

### Common tasks

| To change… | Edit |
|---|---|
| Which sites appear as markers in a district | `src/data/biharHeritageSites.json` → that district's `sites[]` |
| Which districts a zone/region/circuit highlights | that dataset's `districts[]`, using the §6.1 spellings |
| A zone's accent colour | its `color` field |
| The tab labels or order | the `TABS` constant, lines 22–27 |
| District fill/stroke colours | `getDistrictStyle`, lines 135–164 |
| The stat tiles | lines 524–528 (three are hardcoded — see §7, defect 3) |

Because nothing here flows through the CMS, **every one of these changes requires a code
change and a redeploy.**
