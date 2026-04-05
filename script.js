const initialSpots = [
  { name: "姬路城", lat: 34.839449, lng: 134.6939047 },
  { name: "有馬溫泉", lat: 34.7978083, lng: 135.2476961 },
  { name: "明石海峽大橋", lat: 34.6229442, lng: 135.0268186 },
  { name: "Steakland Kobe", lat: 34.6929964, lng: 135.1921423 },
  { name: "南京町 中華街", lat: 34.6882142, lng: 135.1881104 },
  { name: "生田神社", lat: 34.6947159, lng: 135.1907243 },
  { name: "JR三宮站", lat: 34.694659, lng: 135.1949544 },
  { name: "星巴克 神戶北野異人館店", lat: 34.6998321, lng: 135.1902342 },
  { name: "北野天滿神社", lat: 34.7019583, lng: 135.189591 },
  { name: "風見雞之館", lat: 34.7013881, lng: 135.1895175 },
  { name: "Hoshi no Eki Sta.", lat: 34.7336051, lng: 135.2060413 },
  { name: "Kikuseidai Observation Deck", lat: 34.7342898, lng: 135.2072114 },
  { name: "神戶港塔", lat: 34.68263, lng: 135.1866995 },
  { name: "全家便利商店 新町店", lat: 34.6760567, lng: 135.495857 },
  { name: "AEON FOOD STYLE Yotsubashi Store", lat: 34.6755318, lng: 135.4964093 },
  { name: "四ツ橋駅", lat: 34.674135, lng: 135.496727 },
  { name: "難波站", lat: 34.6670979, lng: 135.5003424 },
  { name: "法善寺", lat: 34.6679398, lng: 135.5024676 },
  { name: "JR難波", lat: 34.6660463, lng: 135.4952492 },
  { name: "四橋", lat: 34.6741351, lng: 135.496727 },
  { name: "道頓堀", lat: 34.6687234, lng: 135.5012971 },
  { name: "難波八阪神社", lat: 34.6615592, lng: 135.4967039 },
  { name: "OMO7 大阪飯店 by 星野集團", lat: 34.6508135, lng: 135.5018895 },
  { name: "大阪天滿宮", lat: 34.6960576, lng: 135.5126556 },
  { name: "梅田藍天大樓", lat: 34.7052872, lng: 135.4896527 },
  { name: "大阪城", lat: 34.6872571, lng: 135.5258546 },
  { name: "金閣寺", lat: 35.03937, lng: 135.7292431 },
];

const regionLabels = {
  Osaka: "大阪",
  Kyoto: "京都",
  Nara: "奈良",
  Hyogo: "兵庫",
  Stay: "住宿",
  Custom: "其他",
};

const regionDescriptions = {
  Osaka: "城市感、夜生活和購物熱區",
  Kyoto: "古寺與經典街景的文化區",
  Nara: "古都寺社與寬闊公園氛圍",
  Hyogo: "城堡、港灣與溫泉路線",
  Stay: "這趟旅程的住宿與休息據點",
  Custom: "旅途中另外加入的新景點",
};

const placeQueryOverrides = {
  "姬路城": "姬路城 Himeji Castle",
  "有馬溫泉": "有馬溫泉 Arima Onsen",
  "明石海峽大橋": "明石海峽大橋 Akashi Kaikyo Bridge",
  "南京町 中華街": "南京町 中華街 Kobe Chinatown",
  "生田神社": "生田神社 Ikuta Shrine",
  "神戶港塔": "神戶港塔 Kobe Port Tower",
  "道頓堀": "道頓堀 Dotonbori",
  "大阪城": "大阪城 Osaka Castle",
  "金閣寺": "金閣寺 Kinkaku-ji",
  "梅田藍天大樓": "梅田藍天大樓 Umeda Sky Building",
  "法善寺": "法善寺 Osaka",
  "北野天滿神社": "北野天滿神社 Kobe",
  "風見雞之館": "風見雞之館 Kobe",
  "大阪天滿宮": "大阪天滿宮",
  "難波八阪神社": "難波八阪神社",
  "四ツ橋駅": "四ツ橋駅 Osaka",
  "難波站": "難波駅 Osaka",
  "JR難波": "JR難波駅 Osaka",
  "JR三宮站": "三ノ宮駅 Kobe",
  "全家便利商店 新町店": "FamilyMart Shimmachi Osaka",
  "AEON FOOD STYLE Yotsubashi Store": "AEON FOOD STYLE Yotsubashi Store Osaka",
  "Steakland Kobe": "Steakland Kobe",
  "星巴克 神戶北野異人館店": "Starbucks Kobe Kitano Ijinkan",
  "Hoshi no Eki Sta.": "Hoshi no Eki Mount Maya",
  "Kikuseidai Observation Deck": "Kikuseidai Observation Deck",
  "OMO7 大阪飯店 by 星野集團": "OMO7 Osaka by Hoshino Resorts",
  "四橋": "四ツ橋 Osaka",
  "伊根舟屋": "伊根の舟屋 Ine Funaya Kyoto",
};

const imageCache = new Map();
const SPOTS_STORAGE_KEY = "kansai-trip-spots-v1";
const PLACE_SEARCH_ENDPOINT = "/api/place-search";
const PLACE_PHOTO_ENDPOINT = "/api/place-photo";
const PUBLIC_CONFIG_ENDPOINT = "/api/public-config";
const SHARED_SPOTS_ENDPOINT = "/api/shared-spots";
let embedApiKeyPromise = null;

function inferRegionFromLocation(lat, lng, name = "") {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("hotel") ||
    normalizedName.includes("飯店") ||
    normalizedName.includes("酒店") ||
    normalizedName.includes("omo")
  ) {
    return "Stay";
  }

  if (lat >= 34.95) {
    return "Kyoto";
  }

  if (lng <= 135.3) {
    return "Hyogo";
  }

  if (lng >= 135.72) {
    return "Nara";
  }

  return "Osaka";
}

function inferRegionFromSearchResult(result, name = "") {
  const address = result.address || {};
  const addressText = [
    address.state,
    address.province,
    address.city,
    address.county,
    address.town,
    address.city_district,
    result.display_name,
    result.formattedAddress,
    result.displayName?.text,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (name.toLowerCase().includes("hotel") || name.includes("飯店") || name.includes("酒店") || name.toLowerCase().includes("omo")) {
    return "Stay";
  }

  if (addressText.includes("kyoto")) {
    return "Kyoto";
  }

  if (addressText.includes("nara")) {
    return "Nara";
  }

  if (addressText.includes("hyogo") || addressText.includes("kobe") || addressText.includes("himeji")) {
    return "Hyogo";
  }

  if (addressText.includes("osaka")) {
    return "Osaka";
  }

  return inferRegionFromLocation(Number(result.lat), Number(result.lon), name);
}

function getFallbackGradient(region) {
  const gradients = {
    Osaka: "linear-gradient(145deg, rgba(255, 196, 127, 0.95), rgba(210, 109, 66, 0.86))",
    Kyoto: "linear-gradient(145deg, rgba(226, 202, 132, 0.95), rgba(143, 114, 46, 0.88))",
    Nara: "linear-gradient(145deg, rgba(162, 204, 150, 0.95), rgba(72, 124, 78, 0.88))",
    Hyogo: "linear-gradient(145deg, rgba(153, 192, 219, 0.95), rgba(74, 120, 165, 0.88))",
    Stay: "linear-gradient(145deg, rgba(226, 178, 136, 0.95), rgba(125, 78, 51, 0.88))",
    Custom: "linear-gradient(145deg, rgba(255, 196, 127, 0.95), rgba(210, 109, 66, 0.86))",
  };

  return gradients[region] || gradients.Custom;
}

function getPlaceSearchQuery(spot) {
  const base = placeQueryOverrides[spot.name] || spot.name;
  return `${base}, Japan`;
}

function getRouteAddressQuery(spot) {
  return getPlaceSearchQuery(spot);
}

async function getEmbedApiKey() {
  if (!embedApiKeyPromise) {
    embedApiKeyPromise = fetch(PUBLIC_CONFIG_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("無法載入地圖設定");
        }

        const data = await response.json();
        return data.embedApiKey || "";
      })
      .catch(() => "");
  }

  return embedApiKeyPromise;
}

function normalizeAttributions(authorAttributions = []) {
  return authorAttributions
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }

      return entry.displayName || "";
    })
    .filter(Boolean)
    .join(" / ");
}

async function fetchGooglePlacePhoto(spot) {
  const cacheKey = `google:${spot.name}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const url = new URL(PLACE_PHOTO_ENDPOINT, window.location.origin);
  url.searchParams.set("q", getPlaceSearchQuery(spot));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    imageCache.set(cacheKey, null);
    return null;
  }

  const data = await response.json();
  const result = data?.photo?.url
    ? {
        url: data.photo.url,
        attribution: normalizeAttributions(data.photo.authorAttributions || []),
      }
    : null;

  imageCache.set(cacheKey, result);
  return result;
}

function normalizeSpot(spot) {
  return {
    name: spot.name,
    lat: Number(spot.lat),
    lng: Number(spot.lng),
    region: spot.region || inferRegionFromLocation(Number(spot.lat), Number(spot.lng), spot.name),
    image: spot.image || null,
    imageAttribution: spot.imageAttribution || "",
  };
}

function getDefaultSpots() {
  return initialSpots.map((spot) =>
    normalizeSpot({
      ...spot,
      region: inferRegionFromLocation(spot.lat, spot.lng, spot.name),
    }),
  );
}

function loadSpots() {
  try {
    const raw = localStorage.getItem(SPOTS_STORAGE_KEY);
    if (!raw) {
      return getDefaultSpots();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getDefaultSpots();
    }

    return parsed.map(normalizeSpot);
  } catch {
    return getDefaultSpots();
  }
}

function saveSpots() {
  localStorage.setItem(
    SPOTS_STORAGE_KEY,
    JSON.stringify(
      spots.map((spot) => ({
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
        region: spot.region,
        image: spot.image,
        imageAttribution: spot.imageAttribution,
      })),
    ),
  );
}

function refreshSpotViews() {
  saveSpots();
  renderMarkers();
  renderList();
  renderSpotStage();
  populateRouteSelectors();
  renderPhotoCredits();
}

async function loadSharedSpots() {
  const response = await fetch(SHARED_SPOTS_ENDPOINT, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("無法讀取共用景點資料");
  }

  const data = await response.json();
  return Array.isArray(data.spots) ? data.spots.map(normalizeSpot) : [];
}

async function saveSharedSpots() {
  const response = await fetch(SHARED_SPOTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      spots: spots.map((spot) => ({
        name: spot.name,
        lat: spot.lat,
        lng: spot.lng,
        region: spot.region,
        image: spot.image,
        imageAttribution: spot.imageAttribution,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("無法儲存共用景點資料");
  }
}

async function syncSharedSpots() {
  saveSpots();

  try {
    await saveSharedSpots();
  } catch (error) {
    setFormStatus(error instanceof Error ? `${error.message}，目前先保存在這台裝置。` : "共用儲存失敗，目前先保存在這台裝置。");
  }
}

const spots = loadSpots();

const spotList = document.querySelector("#spot-list");
const spotCount = document.querySelector("#spot-count");
const exportSpotsButton = document.querySelector("#export-spots");
const importSpotsButton = document.querySelector("#import-spots");
const importSpotsFileInput = document.querySelector("#import-spots-file");
const spotForm = document.querySelector("#spot-form");
const spotNameInput = document.querySelector("#spot-name");
const formStatus = document.querySelector("#form-status");
const submitButton = spotForm.querySelector('button[type="submit"]');
const spotStageTrack = document.querySelector("#spot-stage-track");
const spotStageTitle = document.querySelector("#spot-stage-title");
const spotStageRegion = document.querySelector("#spot-stage-region");
const photoCredits = document.querySelector("#photo-credits");
const photoCreditsPanel = document.querySelector("#photo-credits-panel");
const routeForm = document.querySelector("#route-form");
const routeOriginSelect = document.querySelector("#route-origin");
const routeDestinationSelect = document.querySelector("#route-destination");
const routeStatus = document.querySelector("#route-status");
const routeEmbed = document.querySelector("#route-embed");
let selectedSpotName = spots[0]?.name ?? "";
const markerRegistry = new Map();

const map = L.map("travel-map", {
  zoomControl: true,
  minZoom: 7,
}).setView([34.78, 135.42], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

function createPopupContent(spot) {
  return `
    <span class="popup-region">${regionLabels[spot.region] || spot.region}</span>
    <div class="popup-name">${spot.name}</div>
  `;
}

function createMarker(spot) {
  const marker = L.marker([spot.lat, spot.lng], {
    icon: L.divIcon({
      className: "",
      html: '<div class="map-spot-icon"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    }),
  });

  marker.bindPopup(createPopupContent(spot));
  marker.on("click", () => {
    selectSpot(spot.name, { flyTo: false, openPopup: false });
  });
  return marker;
}

function renderMarkers() {
  markersLayer.clearLayers();
  markerRegistry.clear();

  const bounds = [];
  spots.forEach((spot) => {
    const marker = createMarker(spot);
    marker.addTo(markersLayer);
    markerRegistry.set(spot.name, marker);
    bounds.push([spot.lat, spot.lng]);
  });

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
}

function renderList() {
  spotList.innerHTML = "";

  spots.forEach((spot) => {
    const item = document.createElement("li");
    const summary = document.createElement("div");
    const name = document.createElement("span");
    const region = document.createElement("span");
    const removeButton = document.createElement("button");

    name.textContent = spot.name;
    region.textContent = regionLabels[spot.region] || spot.region;
    summary.className = "spot-list__summary";
    summary.append(name, region);

    removeButton.type = "button";
    removeButton.className = "spot-list__delete";
    removeButton.textContent = "刪除";
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSpot(spot.name);
    });

    item.dataset.spotName = spot.name;
    item.addEventListener("click", () => {
      selectSpot(spot.name);
    });

    item.append(summary, removeButton);
    spotList.appendChild(item);
  });

  spotCount.textContent = `${spots.length} 個`;
}

function setFormStatus(message) {
  formStatus.textContent = message;
}

function setRouteStatus(message) {
  routeStatus.textContent = message;
}

function renderPhotoCredits() {
  const creditedSpots = spots.filter((spot) => spot.imageAttribution);
  if (!creditedSpots.length) {
    photoCredits.innerHTML = "";
    photoCreditsPanel.hidden = true;
    return;
  }

  photoCreditsPanel.hidden = false;

  photoCredits.innerHTML = creditedSpots
    .map((spot) => `<span class="photo-credits__item">${spot.name} Photo: ${spot.imageAttribution}</span>`)
    .join("");
}

function populateRouteSelectors() {
  const options = spots.map((spot) => `<option value="${spot.name}">${spot.name}</option>`).join("");
  routeOriginSelect.innerHTML = options;
  routeDestinationSelect.innerHTML = options;

  routeOriginSelect.value = spots[0]?.name || "";
  routeDestinationSelect.value = spots[1]?.name || spots[0]?.name || "";
}


function deleteSpot(name) {
  const index = spots.findIndex((spot) => spot.name === name);
  if (index === -1) {
    return;
  }

  spots.splice(index, 1);

  if (selectedSpotName === name) {
    selectedSpotName = spots[0]?.name ?? "";
  }

  refreshSpotViews();
  void syncSharedSpots();
  setFormStatus(`已刪除「${name}」`);
}

function exportSpots() {
  const payload = {
    exportedAt: new Date().toISOString(),
    spots: spots.map((spot) => ({
      name: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      region: spot.region,
      image: spot.image,
      imageAttribution: spot.imageAttribution,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "kansai-trip-spots.json";
  anchor.click();
  URL.revokeObjectURL(url);
  setFormStatus("已匯出景點清單。");
}

async function importSpotsFromFile(file) {
  const content = await file.text();
  const parsed = JSON.parse(content);
  const importedSpots = Array.isArray(parsed) ? parsed : parsed.spots;

  if (!Array.isArray(importedSpots) || importedSpots.length === 0) {
    throw new Error("匯入檔案裡沒有可用的景點資料。");
  }

  spots.splice(0, spots.length, ...importedSpots.map(normalizeSpot));
  selectedSpotName = spots[0]?.name || "";
  refreshSpotViews();
  await syncSharedSpots();
  setFormStatus(`已匯入 ${spots.length} 個景點。`);
}

async function initializeSharedSpots() {
  try {
    const sharedSpots = await loadSharedSpots();

    if (Array.isArray(sharedSpots) && sharedSpots.length > 0) {
      spots.splice(0, spots.length, ...sharedSpots);
      selectedSpotName = spots[0]?.name || "";
      refreshSpotViews();
      return;
    }

    await saveSharedSpots();
  } catch {
    setFormStatus("目前無法連到共用儲存，先使用這台裝置的本機資料。");
  }
}

function applyFallbackImageState(card, region) {
  const plate = card.querySelector(".spot-card-3d__plate");
  const image = card.querySelector(".spot-card-3d__image");
  const overlay = card.querySelector(".spot-card-3d__overlay");

  image.hidden = true;
  image.removeAttribute("src");
  plate.style.background = getFallbackGradient(region);
  overlay.style.background =
    "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(41, 18, 6, 0.1)), linear-gradient(180deg, rgba(40, 20, 8, 0), rgba(40, 20, 8, 0.22))";
}

function hydrateSpotCardImage(card, spot) {
  const image = card.querySelector(".spot-card-3d__image");
  const meta = card.querySelector(".spot-card-3d__meta");

  if (spot.image) {
    image.hidden = false;
    image.src = spot.image;
    meta.textContent = regionDescriptions[spot.region] || regionDescriptions.Custom;
    return;
  }

  applyFallbackImageState(card, spot.region);
  meta.textContent = regionDescriptions[spot.region] || regionDescriptions.Custom;

  fetchGooglePlacePhoto(spot)
    .then((resolvedPhoto) => {
      if (!resolvedPhoto) {
        return;
      }

      spot.image = resolvedPhoto.url;
      spot.imageAttribution = resolvedPhoto.attribution;
      saveSpots();
      image.hidden = false;
      image.src = resolvedPhoto.url;

      meta.textContent = regionDescriptions[spot.region] || regionDescriptions.Custom;
      renderPhotoCredits();
    })
    .catch(() => {
      applyFallbackImageState(card, spot.region);
    });
}

function renderSpotStage() {
  spotStageTrack.innerHTML = "";

  spots.forEach((spot) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "spot-card-3d";
    card.dataset.spotName = spot.name;
    if (spot.name === selectedSpotName) {
      card.classList.add("is-active");
    }

    card.innerHTML = `
      <div class="spot-card-3d__shine"></div>
      <div class="spot-card-3d__plate">
        <img class="spot-card-3d__image" alt="${spot.name}" loading="lazy" hidden />
        <div class="spot-card-3d__overlay"></div>
      </div>
      <span class="spot-card-3d__label">${regionLabels[spot.region] || spot.region}</span>
      <div class="spot-card-3d__name">${spot.name}</div>
      <div class="spot-card-3d__meta">${regionDescriptions[spot.region] || regionDescriptions.Custom}</div>
    `;

    card.addEventListener("click", () => {
      selectSpot(spot.name);
    });

    const image = card.querySelector(".spot-card-3d__image");
    image.addEventListener("error", () => {
      applyFallbackImageState(card, spot.region);
    });

    hydrateSpotCardImage(card, spot);

    spotStageTrack.appendChild(card);
  });

  updateSelectionUI();
}

function updateSelectionUI() {
  const activeSpot = spots.find((spot) => spot.name === selectedSpotName) || spots[0];
  if (!activeSpot) {
    return;
  }

  selectedSpotName = activeSpot.name;
  spotStageTitle.textContent = activeSpot.name;
  spotStageRegion.textContent = "";

  document.querySelectorAll(".spot-card-3d").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.spotName === activeSpot.name);
  });

  document.querySelectorAll(".spot-list li").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.spotName === activeSpot.name);
  });
}

function selectSpot(name, options = {}) {
  const { flyTo = true, openPopup = true } = options;
  const spot = spots.find((entry) => entry.name === name);
  if (!spot) {
    return;
  }

  selectedSpotName = spot.name;
  updateSelectionUI();

  const activeCard = document.querySelector(`.spot-card-3d[data-spot-name="${CSS.escape(spot.name)}"]`);
  activeCard?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

  const marker = markerRegistry.get(spot.name);
  if (marker) {
    if (flyTo) {
      map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
    }

    if (openPopup) {
      marker.openPopup();
    }
  }
}

async function searchSpotLocation(name) {
  const query = getPlaceSearchQuery({ name, region: "Custom" });

  try {
    const response = await fetch(PLACE_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const place = data.place;
      if (place?.location) {
        return {
          lat: Number(place.location.latitude),
          lng: Number(place.location.longitude),
          raw: place,
        };
      }
    }
  } catch {
    // Fall back to OSM when the server function is unavailable.
  }

  const fallbackQueries = [
    query,
    `${name}, Kansai, Japan`,
    `${name}, Japan`,
  ];

  for (const fallbackQuery of fallbackQueries) {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", fallbackQuery);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("搜尋服務暫時無法使用");
    }

    const results = await response.json();
    if (results.length > 0) {
      return {
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
        raw: results[0],
      };
    }
  }

  throw new Error("找不到這個景點，請換一個更完整的名稱試試看");
}

spotForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(spotForm);
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return;
  }

  if (spots.some((spot) => spot.name === name)) {
    setFormStatus(`「${name}」已經在清單裡了`);
    return;
  }

  submitButton.disabled = true;
  setFormStatus(`正在搜尋「${name}」的位置...`);

  try {
    const { lat, lng, raw } = await searchSpotLocation(name);
    const region = inferRegionFromSearchResult(raw, name);
    spots.push({ name, region, lat, lng, image: null, imageAttribution: "" });
    refreshSpotViews();
    await syncSharedSpots();
    spotForm.reset();
    setFormStatus(`已加入「${name}」`);
    selectSpot(name);
    spotNameInput.focus();
  } catch (error) {
    setFormStatus(error instanceof Error ? error.message : "新增失敗，請再試一次");
  } finally {
    submitButton.disabled = false;
  }
});

exportSpotsButton.addEventListener("click", () => {
  exportSpots();
});

importSpotsButton.addEventListener("click", () => {
  importSpotsFileInput.click();
});

importSpotsFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    await importSpotsFromFile(file);
  } catch (error) {
    setFormStatus(error instanceof Error ? error.message : "匯入失敗，請再試一次。");
  } finally {
    importSpotsFileInput.value = "";
  }
});

routeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originSpot = spots.find((spot) => spot.name === routeOriginSelect.value);
  const destinationSpot = spots.find((spot) => spot.name === routeDestinationSelect.value);

  if (!originSpot || !destinationSpot || originSpot.name === destinationSpot.name) {
    setRouteStatus("請選擇不同的起點和終點。");
    return;
  }

  const embedApiKey = await getEmbedApiKey();
  if (!embedApiKey) {
    setRouteStatus("尚未設定內嵌地圖金鑰，請先在 Vercel 設定 GOOGLE_MAPS_EMBED_API_KEY。");
    return;
  }

  const embedUrl = new URL("https://www.google.com/maps/embed/v1/directions");
  embedUrl.searchParams.set("key", embedApiKey);
  embedUrl.searchParams.set("origin", getRouteAddressQuery(originSpot));
  embedUrl.searchParams.set("destination", getRouteAddressQuery(destinationSpot));
  embedUrl.searchParams.set("mode", "transit");
  embedUrl.searchParams.set("language", "zh-TW");
  embedUrl.searchParams.set("region", "JP");

  routeEmbed.src = embedUrl.toString();
  setRouteStatus("");
});
renderMarkers();
renderList();
renderSpotStage();
populateRouteSelectors();
renderPhotoCredits();
routeEmbed.src = "";
void initializeSharedSpots();
