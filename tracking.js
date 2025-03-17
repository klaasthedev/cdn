// **Functie om een SHA-256 hash te genereren in Base64**
async function hashToBase64(input) {
  try {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  } catch (error) {
    console.error("Error hashing input:", error);
    return null;
  }
}

// **Configuratie voor architectuur berekening**
const architectureConfig = {
  memoryMultiplier: 16, // Gewicht voor device memory
  coreMultiplier: 2, // Gewicht voor cores
  fallbackMemory: 4, // Standaard geheugen (in GB) als deviceMemory niet beschikbaar is
  fallbackCores: 4, // Standaard aantal cores als hardwareConcurrency niet beschikbaar is
};

// **Functie om de CPU-architectuur te bepalen**
function getArchitecture(config = architectureConfig) {
  try {
    const deviceMemory = navigator.deviceMemory || config.fallbackMemory;
    const processors = navigator.hardwareConcurrency || config.fallbackCores;

    // Combineer geheugen en processors met gewichten
    return Math.round(deviceMemory * config.memoryMultiplier + processors * config.coreMultiplier);
  } catch (error) {
    console.error("Error fetching architecture:", error);
    return null;
  }
}

// **Functie om audio-informatie te verzamelen**
function getAudioDetails() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const baseLatency = audioContext.baseLatency || null;
    const sampleRate = audioContext.sampleRate || null;
    audioContext.close();

    return { sampleRate, baseLatency };
  } catch (error) {
    console.error("Error fetching audio details:", error);
    return { sampleRate: null, baseLatency: null };
  }
}

// **Functie om de kleurendiepte van het scherm op te halen**
function getColorDepth() {
  try {
    return window.screen.colorDepth || null; // Haalt de diepte van kleuren in bits op
  } catch (error) {
    console.error("Error fetching color depth:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om te controleren of cookies zijn ingeschakeld**
function getCookiesEnabled() {
  try {
    return navigator.cookieEnabled; // Controleer of cookies zijn ingeschakeld
  } catch (error) {
    console.error("Error checking cookie enabled status:", error);
    return false; // Fallback naar false bij een fout
  }
}

// **Functie om de contrastvoorkeur van de gebruiker op te halen**
function getContrastPreference() {
  try {
    if (window.matchMedia("(prefers-contrast: more)").matches) return "more";
    if (window.matchMedia("(prefers-contrast: less)").matches) return "less";
    if (window.matchMedia("(prefers-contrast: no-preference)").matches) return "no-preference";
    return null; // Geen voorkeur
  } catch (error) {
    console.error("Error fetching contrast preference:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om het kleurbereik (color gamut) te bepalen**
function getColorGamut() {
  try {
    if (window.matchMedia("(color-gamut: p3)").matches) return "p3";
    if (window.matchMedia("(color-gamut: rec2020)").matches) return "rec2020";
    if (window.matchMedia("(color-gamut: srgb)").matches) return "srgb";
    return null; // Geen matches
  } catch (error) {
    console.error("Error fetching color gamut:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om Canvas fingerprinting attributen te verzamelen**
async function getCanvasAttributes() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return null;

    canvas.width = 100;
    canvas.height = 100;

    context.fillStyle = "red";
    context.fillRect(10, 10, 50, 50);

    const geometryDataURL = canvas.toDataURL("image/png");
    const textWidth = context.measureText("Test String").width.toString();
    const combinedCanvasData = `${geometryDataURL}-${textWidth}-${navigator.userAgent}`;

    const Geometry = await hashToBase64(combinedCanvasData);
    const Text = await hashToBase64(textWidth);
    const Winding = context.isPointInPath(10, 10);

    return { Geometry, Text, Winding };
  } catch (error) {
    console.error("Error fetching canvas attributes:", error);
    return null;
  }
}

// **Functie om het beschikbare apparaatgeheugen op te halen**
function getDeviceMemory() {
  try {
    return navigator.deviceMemory || null; // Haalt het beschikbare apparaatgeheugen op
  } catch (error) {
    console.error("Error fetching device memory:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om DOM-blockers (zoals adblockers) te detecteren**
function getDomBlockers() {
  try {
    const testDiv = document.createElement("div");
    testDiv.innerHTML = "&nbsp;";
    document.body.appendChild(testDiv);
    const height = testDiv.offsetHeight;
    document.body.removeChild(testDiv);

    const adElement = document.createElement("div");
    adElement.className = "adsbox";
    adElement.style.height = "1px";
    document.body.appendChild(adElement);
    const adBlocked = adElement.offsetHeight === 0;
    document.body.removeChild(adElement);

    return height === 0 || adBlocked;
  } catch (error) {
    console.error("Error detecting DOM blockers:", error);
    return false;
  }
}

// **Functie om emoji-weergave-attributen te bepalen**
function getEmojiAttributes() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return null;

    // Stel canvasdimensies en font in
    canvas.width = 50;
    canvas.height = 50;
    const font = "Times New Roman";
    context.font = font;

    // Emoji tekenen
    const emoji = "😀";
    const x = 8;
    const y = 32; // Startpositie voor emoji
    context.fillText(emoji, x, y);

    // Meet bounding box van de emoji
    const textMetrics = context.measureText(emoji);
    const width = textMetrics.width;
    const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const top = y - textMetrics.actualBoundingBoxAscent;
    const bottom = y + textMetrics.actualBoundingBoxDescent;

    return {
      font,
      width,
      height,
      top,
      bottom,
      left: x,
      right: x + width,
      x,
      y: top,
    };
  } catch (error) {
    console.error("Error calculating emoji attributes:", error);
    return null;
  }
}

// **Functie om CPU-classificatie te bepalen op basis van cores**
function getCpuClass() {
  try {
    const logicalProcessors = navigator.hardwareConcurrency || null;

    if (logicalProcessors === null) {
      return {
        classification: null,
        coreCount: null,
      };
    }

    let classification = "high-end";
    if (logicalProcessors <= 2) {
      classification = "low-end";
    } else if (logicalProcessors <= 4) {
      classification = "mid-range";
    }

    return {
      classification,
      coreCount: logicalProcessors,
    };
  } catch (error) {
    console.error("Error fetching CPU classification:", error);
    return {
      classification: null,
      coreCount: null,
    };
  }
}

// **Functie om lettertypevoorkeuren te bepalen**
function getFontPreferences() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return null;

    // Dynamische configuratie van fontcategorieën
    const fontCategories = ["default", "mono", "sans", "serif", "system", "apple"];
    const testStrings = ["mmmmmm", "iiiiii", "123456"]; // Variatie in tekst
    const fontSizes = [16, 24, 32]; // Dynamische font-sizes

    const results = {};

    fontCategories.forEach((fontCategory) => {
      let totalWidth = 0;
      let count = 0;

      testStrings.forEach((text) => {
        fontSizes.forEach((size) => {
          // Stel font in en meet breedte
          context.font = `${size}px ${fontCategory}`;
          const width = context.measureText(text).width;

          if (width) {
            totalWidth += width;
            count++;
          }
        });
      });

      // Gemiddelde breedte voor de categorie
      results[fontCategory] = count > 0 ? totalWidth / count : null;
    });

    // Specifiek berekende `min`-waarde
    const minWidths = Object.values(results).filter((v) => v !== null);
    results["min"] = minWidths.length ? Math.min(...minWidths) : null;

    return results;
  } catch (error) {
    console.error("Error calculating font preferences:", error);
    return null;
  }
}

// **Functie om beschikbare lettertypen te detecteren**
function getAvailableFonts() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return [];

    const baseFont = "monospace";
    const testString = "mmmmmmmmmmlli";
    const baseWidth = context.measureText(testString).width;

    const fonts = [
      "Agency FB",
      "Calibri",
      "Century",
      "Century Gothic",
      "Franklin Gothic",
      "Haettenschweiler",
      "Leelawadee",
      "Lucida Bright",
      "Lucida Sans",
      "MS Outlook",
      "MS Reference Specialty",
      "MS UI Gothic",
      "MT Extra",
      "Marlett",
      "Microsoft Uighur",
      "Monotype Corsiva",
      "Pristina",
      "Segoe UI Light",
    ];

    const availableFonts = [];
    fonts.forEach((font) => {
      context.font = `16px ${font}, ${baseFont}`;
      const width = context.measureText(testString).width;
      if (width !== baseWidth) {
        availableFonts.push(font);
      }
    });

    return availableFonts;
  } catch (error) {
    console.error("Error detecting available fonts:", error);
    return [];
  }
}

// **Functie om gedwongen kleurinstellingen te detecteren**
function getForcedColors() {
  try {
    return window.matchMedia("(forced-colors: active)").matches;
  } catch (error) {
    console.error("Error detecting forced colors:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om hardware cores (CPU Threads) te bepalen**
function getHardwareConcurrency() {
  try {
    const cores = navigator.hardwareConcurrency;
    return typeof cores === "number" && cores > 0 ? cores : null;
  } catch (error) {
    console.error("Error detecting hardware concurrency:", error);
    return null; // Fallback naar null als er een fout optreedt
  }
}

// **Functie om HDR-ondersteuning te detecteren**
function getHdrSupport() {
  try {
    return (
      window.matchMedia("(dynamic-range: high)").matches ||
      window.matchMedia("(display-p3)").matches // Alternatieve check voor brede kleurengamma
    );
  } catch (error) {
    console.error("Error detecting HDR support:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om IndexedDB-ondersteuning te detecteren**
function getIndexedDBSupport() {
  try {
    return !!window.indexedDB;
  } catch (error) {
    console.error("Error detecting IndexedDB support:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om omgekeerde kleuren te detecteren**
function getInvertedColors() {
  try {
    return window.matchMedia("(inverted-colors: inverted)").matches;
  } catch (error) {
    console.error("Error detecting inverted colors:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om de talenvoorkeuren van de gebruiker te verkrijgen**
function getLanguages() {
  try {
    return navigator.languages ? [...navigator.languages] : ["en"];
  } catch (error) {
    console.error("Error detecting languages:", error);
    return ["en"]; // Fallback naar Engels als er een fout optreedt
  }
}

// **Functie om ondersteuning van LocalStorage te detecteren**
function getLocalStorageSupport() {
  try {
    return !!window.localStorage;
  } catch (error) {
    console.error("Error detecting LocalStorage support:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om een SHA-256 hash te genereren op basis van wiskundige constanten**
async function getMathHash() {
  try {
    const constants = [Math.PI, Math.E, Math.sqrt(2), Math.LN2].join("");
    const encoder = new TextEncoder();
    const data = encoder.encode(constants);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Error generating math hash:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om MathML-attributen te detecteren**
function getMathMLAttributes() {
  try {
    const testDiv = document.createElement("div");
    testDiv.style.fontFamily = "Times New Roman";
    testDiv.innerHTML = "<math><mi>x</mi></math>";
    document.body.appendChild(testDiv);

    const boundingBox = testDiv.getBoundingClientRect();

    // Haal het daadwerkelijk gebruikte font op
    const computedStyle = window.getComputedStyle(testDiv);
    const font = computedStyle.fontFamily || null;

    document.body.removeChild(testDiv);

    return {
      bottom: boundingBox.bottom || null,
      font: font, // Dynamisch opgehaald
      height: boundingBox.height || null,
      left: boundingBox.left || null,
      right: boundingBox.right || null,
      top: boundingBox.top || null,
      width: boundingBox.width || null,
      x: boundingBox.x || null,
      y: boundingBox.y || null,
    };
  } catch (error) {
    console.error("Error detecting MathML attributes:", error);
    return null; // Fallback naar null bij een fout
  }
}

// **Functie om monochrome-ondersteuning te detecteren**
function getMonochromeSupport() {
  try {
    // Controleer of de browser monochrome kleuren gebruikt
    return window.matchMedia("(monochrome)").matches ? 1 : 0;
  } catch (error) {
    console.error("Error detecting monochrome support:", error);
    return 0; // Default naar 0 als er een fout optreedt
  }
}

// **Functie om `openDatabase`-ondersteuning te controleren (verouderd, maar nog relevant)**
function getOpenDatabaseSupport() {
  try {
    return !!window.openDatabase;
  } catch (error) {
    console.error("Error detecting openDatabase support:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om OS CPU-informatie op te halen (alleen Firefox)**
function getOsCpu() {
  try {
    // Controleer of `oscpu` beschikbaar is in navigator (Firefox-specifiek)
    return "oscpu" in navigator ? navigator.oscpu || null : null;
  } catch (error) {
    console.error("Error detecting OS CPU:", error);
    return null; // Fallback naar null als er een fout optreedt
  }
}

// **Functie om te controleren of de browser een ingebouwde PDF-viewer heeft**
function getPdfViewerEnabled() {
  try {
    return "application/pdf" in navigator.mimeTypes;
  } catch (error) {
    console.error("Error detecting PDF viewer:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// **Functie om platforminformatie op te halen**
function getPlatform() {
  try {
    return navigator.platform || null; // Ophalen van platforminformatie
  } catch (error) {
    console.error("Error detecting platform:", error);
    return null; // Default naar null als er een fout optreedt
  }
}

// **Functie om geïnstalleerde plugins in de browser op te halen**
function getPlugins() {
  try {
    return Array.from(navigator.plugins).map((plugin) => ({
      name: plugin.name,
      description: plugin.description,
      mimeTypes: Array.from(plugin).map((mimeType) => ({
        type: mimeType.type,
        suffixes: mimeType.suffixes,
      })),
    }));
  } catch (error) {
    console.error("Error detecting plugins:", error);
    return []; // Default naar een lege array als er een fout optreedt
  }
}

// Configuratie voor privacy-gerelateerde controles
const privacyChecksConfig = [
  {
    name: "privateClickMeasurement",
    check: function () {
      return "navigator" in window && "privateClickMeasurement" in navigator;
    },
    result: true, // Wat te retourneren als deze check slaagt
  },
  {
    name: "strictTrackingPrevention",
    check: function () {
      return (
        "cookieStore" in window ||
        navigator.doNotTrack === "1" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    },
    result: "Limited", // Alternatieve indicatie van versterkte privacy
  },
];

// Dynamische privacy-checkfunctie
function getPrivateClickMeasurement() {
  try {
    for (var i = 0; i < privacyChecksConfig.length; i++) {
      var config = privacyChecksConfig[i];
      if (config.check()) {
        console.log("Privacy check passed:", config.name); // Optionele logging
        return config.result;
      }
    }
    return null; // Geen check geslaagd, standaard naar null
  } catch (error) {
    console.error("Error during privacy check:", error);
    return null; // Default naar null bij fout
  }
}

// Gebruik van de functie
var pcmStatus = getPrivateClickMeasurement();
console.log("Private Click Measurement Status:", pcmStatus);

// **Functie om voorkeur voor verminderde beweging op te halen**
function getReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    console.error("Error detecting reduced motion:", error);
    return false; // Default naar false als er een fout optreedt
  }
}

// Gebruik van de functie
var reducedMotionStatus = getReducedMotion();
console.log("Reduced Motion Status:", reducedMotionStatus);

// **Functie om het schermframe op te halen**
function getScreenFrame() {
  try {
    var screen = window.screen;
    var top = screen.height - screen.availHeight;
    var left = screen.width - screen.availWidth;
    return [top, left, screen.availWidth, screen.availHeight];
  } catch (error) {
    console.error("Error detecting screen frame:", error);
    return null; // Default naar null bij fout
  }
}

// **Functie om schermresolutie op te halen**
function getScreenResolution() {
  try {
    var screen = window.screen;
    return screen.width && screen.height ? [screen.width, screen.height] : null;
  } catch (error) {
    console.error("Error detecting screen resolution:", error);
    return null; // Fallback naar null bij fout
  }
}

// **Functie om sessionStorage-ondersteuning te controleren**
function getSessionStorageSupport() {
  try {
    return !!window.sessionStorage;
  } catch (error) {
    console.error("Error detecting sessionStorage support:", error);
    return false; // Fallback naar false bij fout
  }
}

// **Functie om de tijdzone op te halen**
function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch (error) {
    console.error("Error detecting timezone:", error);
    return null; // Fallback naar null bij fout
  }
}

// **Functie om touch-ondersteuning te detecteren**
function getTouchSupport() {
  try {
    return {
      maxTouchPoints: navigator.maxTouchPoints || null,
      touchEvent: "ontouchstart" in window,
      touchStart: "ontouchstart" in document.documentElement,
    };
  } catch (error) {
    console.error("Error detecting touch support:", error);
    return {
      maxTouchPoints: null,
      touchEvent: false,
      touchStart: false,
    }; // Fallback
  }
}

// **Functie om de vendor op te halen**
function getVendor() {
  try {
    return navigator.vendor || null;
  } catch (error) {
    console.error("Error detecting vendor:", error);
    return null; // Fallback
  }
}

// **Functie om de vendor flavors te detecteren**
function getVendorFlavors() {
  try {
    var flavors = [];
    var userAgent = navigator.userAgent.toLowerCase();

    if (navigator.vendor && navigator.vendor.toLowerCase().includes("google")) {
      flavors.push("chrome");
    }
    if (userAgent.includes("firefox")) {
      flavors.push("firefox");
    }
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      flavors.push("safari");
    }
    
    return flavors.length > 0 ? flavors : ["unknown"];
  } catch (error) {
    console.error("Error detecting vendor flavors:", error);
    return ["unknown"]; // Fallback
  }
}

const getWebGlBasics = async () => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");

      if (!gl) {
        return resolve({
          renderer: null,
          rendererUnmasked: null,
          shadingLanguageVersion: null,
          vendor: null,
          vendorUnmasked: null,
          version: null,
        });
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      resolve({
        renderer: gl.getParameter(gl.RENDERER) || null,
        rendererUnmasked: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null
          : null,
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || null,
        vendor: gl.getParameter(gl.VENDOR) || null,
        vendorUnmasked: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || null
          : null,
        version: gl.getParameter(gl.VERSION) || null,
      });
    } catch (error) {
      console.error("Error fetching WebGL info:", error);
      resolve({
        renderer: null,
        rendererUnmasked: null,
        shadingLanguageVersion: null,
        vendor: null,
        vendorUnmasked: null,
        version: null,
      });
    }
  });
};

// **Functie om WebGL-extensies op te halen**
async function getWebGlExtensions() {
  try {
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl");

    if (!gl) {
      return {
        contextAttributes: null,
        extensionParameters: null,
        extensions: null,
        parameters: null,
        shaderPrecisions: null,
        unsupportedExtensions: [],
      };
    }

    var supportedExtensions = gl.getSupportedExtensions() || [];
    var unsupportedExtensions = [
      "WEBGL_debug_renderer_info",
      "EXT_texture_filter_anisotropic",
    ].filter(function (ext) {
      return !supportedExtensions.includes(ext);
    });

    var attributesHash = JSON.stringify(gl.getContextAttributes());
    var extensionsHash = JSON.stringify(supportedExtensions);
    var parametersHash = JSON.stringify(gl.getParameter(gl.MAX_TEXTURE_SIZE));
    var shaderPrecisionsHash = JSON.stringify(
      gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    );

    return {
      contextAttributes: attributesHash,
      extensionParameters: extensionsHash,
      extensions: extensionsHash,
      parameters: parametersHash,
      shaderPrecisions: shaderPrecisionsHash,
      unsupportedExtensions: unsupportedExtensions,
    };
  } catch (error) {
    console.error("Error detecting WebGL extensions:", error);
    return {
      contextAttributes: null,
      extensionParameters: null,
      extensions: null,
      parameters: null,
      shaderPrecisions: null,
      unsupportedExtensions: [],
    };
  }
}

// **Functie testen**
getWebGlExtensions().then(function (webGlExtensions) {
  console.log("WebGL Extensions:", webGlExtensions);
});

// ✅ Jailbroken detectie
function detectJailbroken() {
  let isJailbroken = false;
  if (navigator.platform.includes("iPhone") || navigator.platform.includes("iPad")) {
    isJailbroken = navigator.userAgent.includes("Cydia") || navigator.userAgent.includes("Substrate");
  }
  console.log("✅ Jailbroken Detectie:", isJailbroken);
  return { result: isJailbroken };
}

// ✅ Frida detectie
function detectFrida() {
  const isFridaDetected = navigator.userAgent.includes("Frida");
  console.log("✅ Frida Detectie:", isFridaDetected);
  return { result: isFridaDetected };
}

// ✅ Privacy detectie
function detectPrivacySettings() {
  let privacyDetected = false;
  const warnings = [];

  if (navigator.doNotTrack === "1") {
    privacyDetected = true;
    warnings.push("Do Not Track is ingeschakeld.");
  }

  console.log("✅ Privacy Instellingen:", { result: privacyDetected, warnings });
  return { result: privacyDetected, warnings };
}

// ✅ Virtual Machine detectie
function detectVirtualMachine() {
  let isVM = false;
  const warnings = [];

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
    isVM = true;
    warnings.push("Lage hardware concurrency, mogelijk een VM.");
  }

  console.log("✅ Virtual Machine Detectie:", { result: isVM, warnings });
  return { result: isVM, warnings };
}

// ✅ Tampering detectie
function detectTampering() {
  let anomalyScore = 0;
  const warnings = [];

  if (!navigator.cookieEnabled) {
    warnings.push("Cookies zijn uitgeschakeld.");
    anomalyScore += 20;
  }
  if (navigator.userAgent.includes("AntiDetect")) {
    warnings.push("AntiDetect browser gedetecteerd.");
    anomalyScore += 50;
  }
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
    warnings.push("Lage hardware concurrency, kan VM zijn.");
    anomalyScore += 10;
  }

  console.log("✅ Tampering Detectie:", { result: anomalyScore > 30, anomalyScore, warnings });
  return { result: anomalyScore > 30, anomalyScore, warnings, antiDetectBrowser: warnings.length > 0 };
}

// ✅ Cloned App detectie
function detectClonedApp() {
  const warnings = [];
  const result = !navigator.userAgent.includes("com.android.vending");

  if (result) {
    warnings.push("App is niet geassocieerd met de officiële Google Play Store.");
  }

  console.log("✅ Cloned App Detectie:", { result, warnings });
  return { result, warnings };
}

// ✅ Bot detectie
async function detectBots() {
  const botDetection = {
    botd: { result: typeof navigator !== "undefined" && /bot|crawl|spider/i.test(navigator.userAgent) },
    meta: { referrerLink: typeof document !== "undefined" ? document.referrer : null },
  };

  console.log("✅ Bot Detectie:", botDetection);
  return botDetection;
}

// ✅ Incognito detectie
function detectIncognito() {
  return new Promise((resolve) => {
    let browserName = "Unknown";

    function __callback(isPrivate) {
      console.log("✅ Incognito Detectie:", { isPrivate, browserName });
      resolve({ isPrivate, browserName });
    }

    function identifyChromium() {
      const ua = navigator.userAgent;
      if (ua.includes("Chrome")) {
        if (navigator.brave !== undefined) {
          return "Brave";
        } else if (ua.includes("Edg")) {
          return "Edge";
        } else if (ua.includes("OPR")) {
          return "Opera";
        }
        return "Chrome";
      }
      return "Chromium";
    }

    function isSafari() {
      return navigator.vendor.includes("Apple");
    }

    function isChrome() {
      return navigator.vendor.includes("Google");
    }

    function isFirefox() {
      return typeof document !== "undefined" && document.documentElement.style.MozAppearance !== undefined;
    }

    function isMSIE() {
      return "msSaveBlob" in navigator;
    }

    // ✅ Safari (macOS & iOS)
    function safariPrivateTest() {
      const tmp_name = String(Math.random());
      try {
        const db = window.indexedDB.open(tmp_name, 1);
        db.onupgradeneeded = function (event) {
          const request = event.target;
          try {
            request.result.createObjectStore("test", { autoIncrement: true }).put(new Blob());
            __callback(false);
          } catch (e) {
            __callback(e.message.includes("BlobURLs are not yet supported"));
          } finally {
            request.result.close();
            window.indexedDB.deleteDatabase(tmp_name);
          }
        };
      } catch (e) {
        __callback(false);
      }
    }

    function oldSafariTest() {
      try {
        window.openDatabase(null, null, null, null);
      } catch (e) {
        __callback(true);
        return;
      }
      try {
        localStorage.setItem("test", "1");
        localStorage.removeItem("test");
      } catch (e) {
        __callback(true);
        return;
      }
      __callback(false);
    }

    function getQuotaLimit() {
      return window.performance?.memory?.jsHeapSizeLimit || 1073741824;
    }

    function chromePrivateTest() {
      navigator.webkitTemporaryStorage.queryUsageAndQuota((_, quota) => {
        const quotaLimit = getQuotaLimit() * 2;
        __callback(quota < quotaLimit);
      });
    }

    function oldChromePrivateTest() {
      window.webkitRequestFileSystem(0, 1, () => __callback(false), () => __callback(true));
    }

    function firefoxPrivateTest() {
      __callback(navigator.serviceWorker === undefined);
    }

    function msiePrivateTest() {
      __callback(window.indexedDB === undefined);
    }

    function main() {
      if (isSafari()) {
        browserName = "Safari";
        safariPrivateTest();
      } else if (isChrome()) {
        browserName = identifyChromium();
        chromePrivateTest();
      } else if (isFirefox()) {
        browserName = "Firefox";
        firefoxPrivateTest();
      } else if (isMSIE()) {
        browserName = "Internet Explorer";
        msiePrivateTest();
      } else {
        __callback(false);
      }
    }

    main();
  });
}


// ✅ Gebruiken als een variabele
detectIncognito().then((incognito) => {
  console.log("🚀 Incognito mode:", incognito.isPrivate ? "✅ Gedetecteerd" : "❌ Niet actief");
  console.log("🚀 Browser:", incognito.browserName);
});

function getClickIDs() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    fbclid: urlParams.get("fbclid") || "",
    gclid: urlParams.get("gclid") || "",
    ttclid: urlParams.get("ttclid") || "",
    epik: urlParams.get("epik") || "",
    twclid: urlParams.get("twclid") || "",
    scCid: urlParams.get("ScCid") || urlParams.get("_scid") || "",
  };
}

function getUTMParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_id: urlParams.get("utm_id") || "",
    utm_source: urlParams.get("utm_source") || "",
    utm_medium: urlParams.get("utm_medium") || "",
    utm_campaign: urlParams.get("utm_campaign") || "",
    utm_term: urlParams.get("utm_term") || "",
    utm_content: urlParams.get("utm_content") || "",
  };
}

function getMetadata() {
  return {
    referrer: document.referrer || "",
    landingPage: window.location.href,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language || "",
    userAgent: navigator.userAgent,
  };
}


(async () => {
  const visitorUUID = localStorage.getItem("visitorUUID") || "missing";
  let sessionUUID = sessionStorage.getItem("sessionUUID") || crypto.randomUUID();
  sessionStorage.setItem("sessionUUID", sessionUUID);

  try {
    const architecture = getArchitecture();
    const audioDetails = getAudioDetails();
    const canvasAttributes = await getCanvasAttributes();
    const colorDepth = getColorDepth();
    const cookiesEnabled = getCookiesEnabled();
    const contrastPreference = getContrastPreference();
    const colorGamut = getColorGamut();
    const cpuClassDetails = getCpuClass();
    const deviceMemory = getDeviceMemory();
    const domBlockers = getDomBlockers();
    const emojiAttributes = getEmojiAttributes();
    const fontPreferences = getFontPreferences();
    const fonts = getAvailableFonts();
    const forcedColors = getForcedColors();
    const hardwareConcurrency = getHardwareConcurrency();
    const hdr = getHdrSupport();
    const indexedDB = getIndexedDBSupport();
    const invertedColors = getInvertedColors();
    const languages = getLanguages();
    const localStorageSupport = getLocalStorageSupport();
    const mathAttributes = await getMathHash();
    const mathMLAttributes = getMathMLAttributes();
    const monochrome = getMonochromeSupport();
    const openDatabase = getOpenDatabaseSupport();
    const osCpu = getOsCpu();
    const pdfViewerEnabled = getPdfViewerEnabled();
    const platform = getPlatform();
    const plugins = getPlugins();
    const privateClickMeasurement = getPrivateClickMeasurement();
    const reducedMotion = getReducedMotion();
    const screenFrame = getScreenFrame();
    const screenResolution = getScreenResolution();
    const sessionStorageSupport = getSessionStorageSupport();
    const timezone = getTimezone();
    const touchSupport = getTouchSupport();
    const vendor = getVendor();
    const vendorFlavors = getVendorFlavors();
    const webGlBasics = await getWebGlBasics();
    const webGlExtensions = await getWebGlExtensions();

    const jailbroken = detectJailbroken();
    const frida = detectFrida();
    const privacy = detectPrivacySettings();
    const vm = detectVirtualMachine();
    const tampering = detectTampering();
    const clonedApp = detectClonedApp();
    const botDetection = await detectBots();
    const incognito = await detectIncognito();

    const clickIDs = getClickIDs();
    const utmParams = getUTMParams();
    const metadata = getMetadata();

    const browserDetails = {
      browserName: navigator.userAgentData?.brands?.[0]?.brand || "Unknown",
      browserMajorVersion: navigator.userAgentData?.brands?.[0]?.version || "Unknown",
      browserFullVersion: navigator.userAgent || "Unknown",
      os: navigator.userAgentData?.platform || "Unknown",
      osVersion: navigator.platform || "Unknown",
      device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      userAgent: navigator.userAgent,
    };

    const sessionData = {
      ClickIDs: Object.entries(clickIDs),
      UTMParams: Object.entries(utmParams),
      Metadata: Object.entries(metadata),
    };

    const rawDeviceAttributes = {
      VisitorID: visitorUUID,
      SessionID: sessionUUID,
      Architecture: architecture,
      AudioSampleRate: audioDetails.sampleRate,
      AudioBaseLatency: audioDetails.baseLatency,
      CanvasGeometry: canvasAttributes?.Geometry,
      CanvasText: canvasAttributes?.Text,
      CanvasWinding: canvasAttributes?.Winding ? 1 : 0,
      ColorDepth: colorDepth,
      ColorGamut: colorGamut,
      ContrastPreference: contrastPreference,
      CookiesEnabled: cookiesEnabled ? 1 : 0,
      CPUClassification: cpuClassDetails.classification,
      CPUCoreCount: cpuClassDetails.coreCount,
      DeviceMemory: deviceMemory,
      DOMBlockers: domBlockers ? 1 : 0,
      EmojiFont: emojiAttributes?.font,
      EmojiWidth: emojiAttributes?.width,
      EmojiHeight: emojiAttributes?.height,
      EmojiTop: emojiAttributes?.top,
      EmojiBottom: emojiAttributes?.bottom,
      EmojiLeft: emojiAttributes?.left,
      EmojiRight: emojiAttributes?.right,
      FontPreferences: JSON.stringify(fontPreferences),
      AvailableFonts: fonts,
      ForcedColors: forcedColors ? 1 : 0,
      HardwareConcurrency: hardwareConcurrency,
      HDR: hdr ? 1 : 0,
      IndexedDB: indexedDB ? 1 : 0,
      InvertedColors: invertedColors ? 1 : 0,
      Languages: languages,
      LocalStorage: localStorageSupport ? 1 : 0,
      MathHash: mathAttributes,
      MathMLAttributes: JSON.stringify(mathMLAttributes),
      Monochrome: monochrome ? 1 : 0,
      OpenDatabase: openDatabase ? 1 : 0,
      OSCpu: osCpu,
      PdfViewerEnabled: pdfViewerEnabled ? 1 : 0,
      Platform: platform,
      Plugins: plugins,
      PrivateClickMeasurement: privateClickMeasurement,
      ReducedMotion: reducedMotion ? 1 : 0,
      ScreenFrame: screenFrame,
      ScreenResolution: screenResolution,
      SessionStorage: sessionStorageSupport ? 1 : 0,
      Timezone: timezone,
      TouchSupport: JSON.stringify(touchSupport),
      Vendor: vendor,
      VendorFlavors: vendorFlavors,
      WebGLRenderer: webGlBasics.renderer,
      WebGLUnmaskedRenderer: webGlBasics.rendererUnmasked,
      WebGLShadingLanguageVersion: webGlBasics.shadingLanguageVersion,
      WebGLVendor: webGlBasics.vendor,
      WebGLUnmaskedVendor: webGlBasics.vendorUnmasked,
      WebGLExtensions: webGlExtensions.extensions,
      Jailbroken: jailbroken,
      Frida: frida,
      Privacy: privacy,
      VirtualMachine: vm,
      Tampering: tampering,
      ClonedApp: clonedApp,
      BotDetection: botDetection,
      IncognitoMode: incognito.isPrivate ? 1 : 0,
    };

    const urlParams = new URLSearchParams(window.location.search);
    const urlParameters = {};
    urlParams.forEach((value, key) => {
      urlParameters[key] = value;
    });

    const sessionActivity = {
      url: window.location.href,
      referrer: document.referrer,
      urlParameters,
    };

    const fingerprintData = {
      visitorUUID,
      sessionUUID,
      sessionActivity,
      browserDetails,
      sessionData,
      rawDeviceAttributes,
    };

    const response = await fetch("http://ogco4ws80gcowcs08socgs4k.5.75.174.75.sslip.io/api/fingerprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fingerprintData),
    });

    const responseData = await response.json();

    if (responseData.visitorUUID && responseData.visitorUUID !== localStorage.getItem("visitorUUID")) {
      localStorage.setItem("visitorUUID", responseData.visitorUUID);
    }

    trackEvent("page_view", {
      referrer: document.referrer,
      landingPage: window.location.href,
      pageType: window.YourPixelData?.pageType || "unknown",
    });

  } catch (error) {
    console.error("Error tijdens verzamelen of verzenden van fingerprint data:", error);
  }
})();

async function trackEvent(eventType, eventData = {}) {
  try {
    const visitorUUID = localStorage.getItem("visitorUUID") || "missing";
    const sessionUUID = sessionStorage.getItem("sessionUUID") || "missing";

    const eventPayload = {
      visitorUUID,
      sessionUUID,
      store: window.YourPixelData?.store || "unknown",
      pageType: window.YourPixelData?.pageType || "unknown",
      timestamp: Date.now(),
      eventType,
      eventData,
    };

    const response = await fetch("http://ogco4ws80gcowcs08socgs4k.5.75.174.75.sslip.io/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });

    await response.json();

  } catch (error) {
    console.error("Fout bij verzenden van event:", error);
  }
}
