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
const downloadButton = document.querySelector("#downloadButton");
const outputSize = document.querySelector("#outputSize");
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

async function loadSelectedFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  try {
    state.image = await loadUnmirroredImage(file);
    state.zoom = 1;
    state.offsetX = 0;
    state.offsetY = 0;
    zoomRange.value = "1";
    xRange.value = "0";
    yRange.value = "0";
    emptyState.classList.add("hidden");
    downloadButton.disabled = false;
    drawPhoto();
  } catch (error) {
    console.warn("Photo could not be loaded", error);
  }
}

async function loadUnmirroredImage(file) {
  const orientation = await readExifOrientation(file);
  const source = await decodeImageWithoutBrowserOrientation(file);
  return normalizeImageOrientation(source, orientation);
}

async function decodeImageWithoutBrowserOrientation(file) {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "none" });
    } catch (error) {
      console.warn("Falling back to browser image decode", error);
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode failed"));
    };
    image.src = url;
  });
}

function normalizeImageOrientation(source, orientation) {
  const rotation = rotationFromExifOrientation(orientation);
  const swapDimensions = rotation === 90 || rotation === 270;
  const normalized = document.createElement("canvas");
  normalized.width = swapDimensions ? source.height : source.width;
  normalized.height = swapDimensions ? source.width : source.height;

  const normalizedCtx = normalized.getContext("2d");
  normalizedCtx.imageSmoothingEnabled = true;
  normalizedCtx.imageSmoothingQuality = "medium";

  if (rotation === 90) {
    normalizedCtx.translate(normalized.width, 0);
    normalizedCtx.rotate(Math.PI / 2);
  } else if (rotation === 180) {
    normalizedCtx.translate(normalized.width, normalized.height);
    normalizedCtx.rotate(Math.PI);
  } else if (rotation === 270) {
    normalizedCtx.translate(0, normalized.height);
    normalizedCtx.rotate(-Math.PI / 2);
  }

  normalizedCtx.drawImage(source, 0, 0);

  if ("close" in source) source.close();
  return normalized;
}

function rotationFromExifOrientation(orientation) {
  if (orientation === 3 || orientation === 4) return 180;
  if (orientation === 5 || orientation === 6) return 90;
  if (orientation === 7 || orientation === 8) return 270;
  return 0;
}

async function readExifOrientation(file) {
  const buffer = await file.slice(0, 128 * 1024).arrayBuffer();
  const view = new DataView(buffer);

  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return 1;

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset, false);
    offset += 2;
    if ((marker & 0xff00) !== 0xff00) break;

    const size = view.getUint16(offset, false);
    offset += 2;
    if (marker === 0xffe1 && offset + size <= view.byteLength) {
      return readOrientationFromExifSegment(view, offset, size - 2);
    }
    offset += size - 2;
  }

  return 1;
}

function readOrientationFromExifSegment(view, offset, length) {
  if (length < 14) return 1;
  const exifHeader = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
  for (let i = 0; i < exifHeader.length; i += 1) {
    if (view.getUint8(offset + i) !== exifHeader[i]) return 1;
  }

  const tiffOffset = offset + 6;
  const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
  const firstIfdOffset = view.getUint32(tiffOffset + 4, littleEndian);
  const ifdOffset = tiffOffset + firstIfdOffset;
  if (ifdOffset + 2 > view.byteLength) return 1;

  const entryCount = view.getUint16(ifdOffset, littleEndian);
  for (let i = 0; i < entryCount; i += 1) {
    const entryOffset = ifdOffset + 2 + i * 12;
    if (entryOffset + 12 > view.byteLength) return 1;
    if (view.getUint16(entryOffset, littleEndian) === 0x0112) {
      return view.getUint16(entryOffset + 8, littleEndian);
    }
  }

  return 1;
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
  drawGuides();
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
