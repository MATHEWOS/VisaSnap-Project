const photoSizes = [
  { id: "us", label: "United States visa - 2 x 2 in", width: 600, height: 600, file: "visasnap-us-photo.jpg" },
  { id: "schengen", label: "Schengen visa - 35 x 45 mm", width: 413, height: 531, file: "visasnap-schengen-photo.jpg" },
  { id: "india", label: "India e-Visa - square", width: 600, height: 600, file: "visasnap-india-photo.jpg" },
  { id: "uk", label: "United Kingdom visa - 35 x 45 mm", width: 413, height: 531, file: "visasnap-uk-photo.jpg" },
  { id: "generic", label: "Generic passport - 35 x 45 mm", width: 413, height: 531, file: "visasnap-passport-photo.jpg" }
];

const visaLinks = [
  {
    country: "Australia",
    type: "Official immigration portal",
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    note: "Use the visa finder to choose the correct visitor or transit visa."
  },
  {
    country: "Cambodia",
    type: "Official e-Visa portal",
    url: "https://www.evisa.gov.kh/",
    note: "Government e-visa service for eligible travelers."
  },
  {
    country: "Canada",
    type: "Official visitor visa portal",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    note: "Start here for visitor visa or electronic travel authorization guidance."
  },
  {
    country: "Egypt",
    type: "Official e-Visa portal",
    url: "https://www.visa2egypt.gov.eg/",
    note: "Official Egypt electronic visa application portal."
  },
  {
    country: "Ethiopia",
    type: "Official e-Visa portal",
    url: "https://www.evisa.gov.et/",
    note: "Government e-visa service for Ethiopia."
  },
  {
    country: "India",
    type: "Official e-Visa portal",
    url: "https://indianvisaonline.gov.in/evisa/",
    note: "Official Government of India e-Visa application site."
  },
  {
    country: "Kenya",
    type: "Official electronic travel authorization",
    url: "https://www.etakenya.go.ke/",
    note: "Kenya uses an electronic travel authorization process."
  },
  {
    country: "New Zealand",
    type: "Official immigration portal",
    url: "https://www.immigration.govt.nz/new-zealand-visas",
    note: "Find visitor visa and NZeTA application options."
  },
  {
    country: "Sri Lanka",
    type: "Official ETA portal",
    url: "https://www.eta.gov.lk/",
    note: "Official electronic travel authorization portal."
  },
  {
    country: "Thailand",
    type: "Official e-Visa portal",
    url: "https://www.thaievisa.go.th/",
    note: "Official Thai electronic visa application portal."
  },
  {
    country: "Turkey",
    type: "Official e-Visa portal",
    url: "https://www.evisa.gov.tr/",
    note: "Official Republic of Turkey e-Visa application system."
  },
  {
    country: "United Arab Emirates",
    type: "Official government visa information",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id",
    note: "Visa process can depend on emirate, airline, sponsor, and nationality."
  },
  {
    country: "United Kingdom",
    type: "Official visa portal",
    url: "https://www.gov.uk/browse/visas-immigration/tourist-short-stay-visas",
    note: "Official UK government visa and immigration application guidance."
  },
  {
    country: "United States",
    type: "Official visa portal",
    url: "https://travel.state.gov/content/travel/en/us-visas.html",
    note: "Official U.S. Department of State visa information."
  },
  {
    country: "Vietnam",
    type: "Official e-Visa portal",
    url: "https://evisa.gov.vn/",
    note: "Official Vietnam electronic visa application portal."
  }
];

const state = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  bg: "#ffffff",
  enhanceMode: "off",
  size: photoSizes[0]
};

const canvas = document.querySelector("#photoCanvas");
const ctx = canvas.getContext("2d");
const cameraInput = document.querySelector("#cameraInput");
const galleryInput = document.querySelector("#galleryInput");
const emptyState = document.querySelector("#emptyState");
const sizeSelect = document.querySelector("#sizeSelect");
const zoomRange = document.querySelector("#zoomRange");
const xRange = document.querySelector("#xRange");
const yRange = document.querySelector("#yRange");
const backgroundSelect = document.querySelector("#backgroundSelect");
const enhanceSelect = document.querySelector("#enhanceSelect");
const downloadButton = document.querySelector("#downloadButton");
const outputSize = document.querySelector("#outputSize");
const enhanceStatus = document.querySelector("#enhanceStatus");
const countrySearch = document.querySelector("#countrySearch");
const countryList = document.querySelector("#countryList");
const visaResult = document.querySelector("#visaResult");
const installButton = document.querySelector("#installButton");
const offlineStatus = document.querySelector("#offlineStatus");
const installStatus = document.querySelector("#installStatus");
const photoMonetization = document.querySelector("#photoMonetization");
const visaMonetization = document.querySelector("#visaMonetization");

let deferredInstallPrompt = null;
let installStatusTimer = null;

function initialize() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  photoSizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = size.id;
    option.textContent = size.label;
    sizeSelect.append(option);
  });

  drawPlaceholder();
  renderCountries(visaLinks);
  bindEvents();
  switchPanelFromHash();
  renderMonetization();
  updateInstallAvailability();
  updateConnectionStatus();
  registerServiceWorker();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchPanel(tab.dataset.panel));
  });

  document.querySelector("#themeButton").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "" : "dark";
    document.documentElement.dataset.theme = nextTheme;
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
    installButton.textContent = "Install";
  });

  installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      showInstallStatus();
      return;
    }

    installButton.hidden = true;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installButton.hidden = true;
    installStatus.hidden = true;
  });

  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  window.addEventListener("hashchange", switchPanelFromHash);

  cameraInput.addEventListener("change", loadSelectedFile);
  galleryInput.addEventListener("change", loadSelectedFile);

  sizeSelect.addEventListener("change", () => {
    state.size = photoSizes.find((size) => size.id === sizeSelect.value) || photoSizes[0];
    resizeCanvas();
    drawPhoto();
  });

  zoomRange.addEventListener("input", () => {
    state.zoom = Number(zoomRange.value);
    drawPhoto();
  });

  xRange.addEventListener("input", () => {
    state.offsetX = Number(xRange.value);
    drawPhoto();
  });

  yRange.addEventListener("input", () => {
    state.offsetY = Number(yRange.value);
    drawPhoto();
  });

  backgroundSelect.addEventListener("change", () => {
    state.bg = backgroundSelect.value;
    drawPhoto();
  });

  enhanceSelect.addEventListener("change", () => {
    state.enhanceMode = enhanceSelect.value;
    drawPhoto();
  });

  downloadButton.addEventListener("click", downloadPhoto);

  countrySearch.addEventListener("input", () => {
    const query = countrySearch.value.trim().toLowerCase();
    const matches = visaLinks.filter((item) => item.country.toLowerCase().includes(query));
    renderCountries(matches);
  });
}

function switchPanel(panelId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === panelId);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === panelId);
  });
}

function switchPanelFromHash() {
  const normalizedHash = window.location.hash.toLowerCase();
  if (normalizedHash === "#evisa" || normalizedHash === "#visa") {
    switchPanel("visaPanel");
    return;
  }

  if (normalizedHash === "#photo") {
    switchPanel("photoPanel");
  }
}

function loadSelectedFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      state.image = image;
      state.zoom = 1;
      state.offsetX = 0;
      state.offsetY = 0;
      zoomRange.value = "1";
      xRange.value = "0";
      yRange.value = "0";
      emptyState.classList.add("hidden");
      downloadButton.disabled = false;
      drawPhoto();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function resizeCanvas() {
  canvas.width = state.size.width;
  canvas.height = state.size.height;
  outputSize.textContent = `${state.size.width} x ${state.size.height} px`;
}

function drawPlaceholder() {
  resizeCanvas();
  ctx.fillStyle = state.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGuides();
}

function drawPhoto() {
  if (!state.image) {
    drawPlaceholder();
    return;
  }

  const { width, height } = canvas;
  ctx.fillStyle = state.bg;
  ctx.fillRect(0, 0, width, height);

  const scale = Math.max(width / state.image.width, height / state.image.height) * state.zoom;
  const drawWidth = state.image.width * scale;
  const drawHeight = state.image.height * scale;
  const maxShiftX = Math.max(0, (drawWidth - width) / 2);
  const maxShiftY = Math.max(0, (drawHeight - height) / 2);
  const x = (width - drawWidth) / 2 + state.offsetX * maxShiftX;
  const y = (height - drawHeight) / 2 + state.offsetY * maxShiftY;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "medium";
  ctx.drawImage(state.image, x, y, drawWidth, drawHeight);
  applyPhotoEnhancements();
  drawGuides();
}

function applyPhotoEnhancements() {
  if (state.enhanceMode === "off") {
    enhanceStatus.textContent = "Original mode is on. The photo is not brightened, sharpened, filtered, mirrored, or flipped.";
    return;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const background = hexToRgb(state.bg);
  const averageEdge = sampleEdgeColor(data, canvas.width, canvas.height);
  const tolerance = estimateBackgroundTolerance(data, canvas.width, canvas.height, averageEdge);
  let replacedPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const distance = colorDistance(data[i], data[i + 1], data[i + 2], averageEdge.r, averageEdge.g, averageEdge.b);
    const edgeWeight = backgroundBlendWeight(distance, tolerance);

    if (state.enhanceMode === "auto" && edgeWeight > 0) {
      data[i] = Math.round(mix(data[i], background.r, edgeWeight));
      data[i + 1] = Math.round(mix(data[i + 1], background.g, edgeWeight));
      data[i + 2] = Math.round(mix(data[i + 2], background.b, edgeWeight));
      if (edgeWeight > 0.72) replacedPixels += 1;
    }

  }

  ctx.putImageData(imageData, 0, 0);

  const percent = Math.round((replacedPixels / (canvas.width * canvas.height)) * 100);
  enhanceStatus.textContent = percent > 8
    ? `Only the likely plain background was replaced with ${backgroundSelect.selectedOptions[0].textContent.toLowerCase()}. The face and photo detail were not enhanced.`
    : "No strong plain background was detected. The photo was left mostly unchanged.";
}

function sampleEdgeColor(data, width, height) {
  const samples = [];
  const step = Math.max(4, Math.floor(Math.min(width, height) / 36));
  const inset = Math.max(2, Math.floor(Math.min(width, height) * 0.035));

  for (let x = inset; x < width - inset; x += step) {
    samples.push(getPixel(data, width, x, inset));
    samples.push(getPixel(data, width, x, height - inset - 1));
  }

  for (let y = inset; y < height - inset; y += step) {
    samples.push(getPixel(data, width, inset, y));
    samples.push(getPixel(data, width, width - inset - 1, y));
  }

  const filtered = rejectColorOutliers(samples);
  return averageColor(filtered.length ? filtered : samples);
}

function rejectColorOutliers(samples) {
  const average = averageColor(samples);
  const distances = samples.map((sample) => colorDistance(sample.r, sample.g, sample.b, average.r, average.g, average.b));
  const sorted = [...distances].sort((a, b) => a - b);
  const cutoff = sorted[Math.floor(sorted.length * 0.72)] || 64;
  return samples.filter((sample, index) => distances[index] <= cutoff + 18);
}

function estimateBackgroundTolerance(data, width, height, edgeColor) {
  const distances = [];
  const step = Math.max(6, Math.floor(Math.min(width, height) / 28));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (x > width * 0.22 && x < width * 0.78 && y > height * 0.16 && y < height * 0.9) continue;
      const pixel = getPixel(data, width, x, y);
      distances.push(colorDistance(pixel.r, pixel.g, pixel.b, edgeColor.r, edgeColor.g, edgeColor.b));
    }
  }

  distances.sort((a, b) => a - b);
  const median = distances[Math.floor(distances.length * 0.5)] || 30;
  const upper = distances[Math.floor(distances.length * 0.78)] || 90;
  return clamp(Math.max(34, median * 1.55, upper * 0.72), 34, 118);
}

function backgroundBlendWeight(distance, tolerance) {
  const start = tolerance * 0.72;
  const end = tolerance * 1.55;
  if (distance <= start) return 1;
  if (distance >= end) return 0;
  const t = (distance - start) / (end - start);
  return 1 - smoothstep(t);
}

function getPixel(data, width, x, y) {
  const index = (y * width + x) * 4;
  return { r: data[index], g: data[index + 1], b: data[index + 2] };
}

function averageColor(colors) {
  const total = colors.reduce((sum, color) => ({
    r: sum.r + color.r,
    g: sum.g + color.g,
    b: sum.b + color.b
  }), { r: 0, g: 0, b: 0 });

  return {
    r: total.r / colors.length,
    g: total.g / colors.length,
    b: total.b / colors.length
  };
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const numeric = Number.parseInt(value.length === 3
    ? value.split("").map((char) => char + char).join("")
    : value, 16);

  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255
  };
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function smoothstep(value) {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function mix(a, b, weight) {
  return a * (1 - weight) + b * weight;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function drawGuides() {
  const { width, height } = canvas;
  ctx.save();
  ctx.strokeStyle = "rgba(15, 118, 110, 0.5)";
  ctx.lineWidth = Math.max(2, width * 0.004);
  ctx.setLineDash([10, 8]);

  const faceWidth = width * 0.56;
  const faceHeight = height * 0.68;
  const faceX = (width - faceWidth) / 2;
  const faceY = height * 0.16;
  ctx.strokeRect(faceX, faceY, faceWidth, faceHeight);

  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.52);
  ctx.lineTo(width * 0.8, height * 0.52);
  ctx.moveTo(width * 0.5, height * 0.1);
  ctx.lineTo(width * 0.5, height * 0.9);
  ctx.stroke();
  ctx.restore();
}

function downloadPhoto() {
  if (!state.image) return;

  drawPhoto();
  canvas.toBlob((blob) => {
    if (!blob) return;

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.download = state.size.file;
    link.href = url;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/jpeg", 0.9);
}

function renderCountries(items) {
  countryList.replaceChildren();

  if (!items.length) {
    const fallback = document.createElement("button");
    fallback.className = "country-button";
    fallback.type = "button";
    fallback.innerHTML = "<strong>Search official sources</strong><span>No curated match</span>";
    fallback.addEventListener("click", () => renderFallback(countrySearch.value.trim()));
    countryList.append(fallback);
    return;
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "country-button";
    button.type = "button";
    button.innerHTML = `<strong>${item.country}</strong><span>${item.type}</span>`;
    button.addEventListener("click", () => renderVisa(item, button));
    countryList.append(button);
  });
}

function renderVisa(item, selectedButton) {
  document.querySelectorAll(".country-button").forEach((button) => button.classList.remove("active"));
  selectedButton.classList.add("active");

  visaResult.innerHTML = `
    <h2>${item.country}</h2>
    <p>${item.note}</p>
    <a class="visa-link" href="${item.url}" target="_blank" rel="noopener">Open official link</a>
    <span class="visa-meta">${item.type}. Check eligibility and fees on the destination government site before paying.</span>
  `;
}

function renderFallback(country) {
  const query = encodeURIComponent(`${country || "destination"} official e visa government application`);
  const url = `https://www.google.com/search?q=${query}`;
  visaResult.innerHTML = `
    <h2>Find official portal</h2>
    <p>No curated link is saved for this country yet. Use the search below and prefer government domains such as .gov, .gov.xx, or official immigration ministry sites.</p>
    <a class="visa-link" href="${url}" target="_blank" rel="noopener">Search official links</a>
    <span class="visa-meta">Avoid sponsored lookalike visa sites unless the official government page sends you there.</span>
  `;
}

function renderMonetization() {
  const config = window.VisaSnapMonetization || {};
  const hasPayment = Boolean(config.stripePaymentLink);
  const hasOffers = Array.isArray(config.offers) && config.offers.length > 0;
  const hasAds = Boolean(config.adsense?.client && config.adsense?.slot);

  if (!hasPayment && !hasOffers && !hasAds) return;

  const fragments = [];

  if (hasPayment) {
    const features = Array.isArray(config.proFeatures) ? config.proFeatures : [];
    fragments.push(`
      <article class="revenue-card pro-card">
        <div>
          <span class="revenue-kicker">Pro</span>
          <h2>VisaSnap Pro</h2>
          <p>Support the app and help fund more country presets, offline polish, and launch updates.</p>
          ${features.length ? `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>` : ""}
        </div>
        <a class="revenue-link" href="${escapeAttribute(config.stripePaymentLink)}" target="_blank" rel="noopener sponsored">${escapeHtml(config.stripeLabel || "Unlock Pro")}</a>
      </article>
    `);
  }

  if (hasOffers) {
    const cards = config.offers.map((offer) => `
      <a class="offer-card" href="${escapeAttribute(offer.url)}" target="_blank" rel="noopener sponsored">
        <span>${escapeHtml(offer.label || "Partner")}</span>
        <strong>${escapeHtml(offer.title || "Travel offer")}</strong>
        <small>${escapeHtml(offer.description || "Sponsored partner link")}</small>
      </a>
    `).join("");

    fragments.push(`
      <section class="revenue-card">
        <span class="revenue-kicker">Sponsored</span>
        <div class="offer-grid">${cards}</div>
        <p class="disclosure">VisaSnap may earn a commission from sponsored partner links.</p>
      </section>
    `);
  }

  if (hasAds) {
    loadAdSense(config.adsense.client);
    fragments.push(`
      <aside class="ad-card" aria-label="Advertisement">
        <span>Advertisement</span>
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${escapeAttribute(config.adsense.client)}"
          data-ad-slot="${escapeAttribute(config.adsense.slot)}"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </aside>
    `);
  }

  const html = fragments.join("");
  photoMonetization.innerHTML = html;
  visaMonetization.innerHTML = html;
  photoMonetization.hidden = false;
  visaMonetization.hidden = false;

  if (hasAds) {
    window.setTimeout(() => {
      document.querySelectorAll(".adsbygoogle").forEach(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    }, 0);
  }
}

function loadAdSense(client) {
  if (document.querySelector("script[data-visasnap-adsense]")) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.visasnapAdsense = "true";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.append(script);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function updateConnectionStatus(event) {
  if (event?.type === "offline") {
    offlineStatus.hidden = false;
    return;
  }

  if (event?.type === "online") {
    offlineStatus.hidden = true;
    return;
  }

  offlineStatus.hidden = navigator.onLine;
}

function updateInstallAvailability() {
  if (isStandaloneMode()) {
    installButton.hidden = true;
    return;
  }

  if (isIos()) {
    installButton.hidden = false;
    installButton.textContent = "Add";
  }
}

function showInstallStatus() {
  installStatus.hidden = false;
  window.clearTimeout(installStatusTimer);
  installStatusTimer = window.setTimeout(() => {
    installStatus.hidden = true;
  }, 7000);
}

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) || (navigator.maxTouchPoints > 1 && /macintosh/i.test(window.navigator.userAgent));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("VisaSnap offline setup failed", error);
    });
  });
}

initialize();
