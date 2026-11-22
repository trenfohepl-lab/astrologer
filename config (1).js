/* =====================================================================
   VEDIC ASTROLOGER WEBSITE — CENTRAL CONFIG
   ---------------------------------------------------------------------
   To customise for a new client: edit the values in SITE_CONFIG below
   (name, WhatsApp number, services, testimonials, videos) and deploy.

   The Admin Panel (admin.html) can also edit this content live. Its
   edits are stored in the browser (LocalStorage) and, if you enable
   Firebase below, synced to Firebase Realtime Database so every visitor
   sees them. Use Admin → Sync → "Export config.js" to copy the updated
   block back into this file permanently.

   Everything ABOVE the "ENGINE" marker is yours to edit.
   Do not edit anything below the marker.
   ===================================================================== */

window.SITE_CONFIG = {

  /* ---------- 1. GURUJI PROFILE ---------- */
  guruji: {
    name: "Acharya Vishwanath Sharma",
    title: "Vedic Astrologer & Vastu Consultant",
    tagline: "Guiding families with the timeless wisdom of Jyotish Shastra — clear predictions, practical remedies, lasting peace.",
    experienceYears: 18,
    kundlisAnalyzed: 10000,
    whatsapp: "919876543210",   // country code + number, digits only (10 digits = India, 91 auto-added)
    photo: "",                  // paste an image URL; leave empty to use the built-in Om avatar
    location: "New Delhi, India",
    email: "contact@example.com",
    instagram: "",              // full URL, e.g. https://instagram.com/yourhandle
    youtube: "",                // full channel URL
    highlights: ["100% Confidential", "Hindi & English", "Online Worldwide"]
  },

  /* ---------- 2. SERVICES (price in INR) ---------- */
  services: [
    {
      id: "kundli-matching", icon: "💞", name: "Kundli Matching (Gun Milan)",
      duration: "30 min", price: 1100, popular: false,
      points: ["36-Guna Ashtakoota analysis", "Manglik & Nadi dosha check", "Compatibility & marriage timing", "Remedies for doshas"]
    },
    {
      id: "career-finance", icon: "💼", name: "Career & Finance Reading",
      duration: "45 min", price: 2100, popular: true,
      points: ["Dasha-Antardasha career timeline", "Business vs job guidance", "Wealth yogas & investment timing", "Personalised remedies"]
    },
    {
      id: "vastu-shastra", icon: "🏡", name: "Vastu Shastra Consultation",
      duration: "60 min", price: 3100, popular: false,
      points: ["Home / office / shop layout review", "Direction & energy correction", "Simple no-demolition remedies", "Online (floor-plan) or on-site"]
    },
    {
      id: "marriage-relationship", icon: "💍", name: "Marriage & Relationship",
      duration: "45 min", price: 2500, popular: false,
      points: ["Delay-in-marriage analysis", "Partner traits & meeting windows", "Relationship harmony remedies", "Family & progeny guidance"]
    },
    {
      id: "gemstone", icon: "💎", name: "Gemstone Consultation",
      duration: "30 min", price: 1500, popular: false,
      points: ["Right Ratna as per your Kundli", "Weight, metal, finger & day", "Wearing & energising vidhi", "Stones to avoid"]
    }
  ],

  /* ---------- 3. TESTIMONIALS ---------- */
  testimonials: [
    { name: "Priya Mehta", city: "Mumbai", rating: 5,
      text: "Guruji's Kundli matching was incredibly accurate. He explained every dosha calmly and gave simple remedies. Our wedding went beautifully." },
    { name: "Rahul Verma", city: "Lucknow", rating: 5,
      text: "I was stuck in my career for years. The dasha timeline he shared matched my life exactly, and within months I got the promotion he predicted." },
    { name: "Sunita Agarwal", city: "Jaipur", rating: 5,
      text: "The Vastu corrections for our shop were easy and cost almost nothing. Business improved noticeably in two months. Highly recommended." },
    { name: "Amit Khanna", city: "Delhi", rating: 4,
      text: "Very honest and practical. No fear-mongering, only clear guidance. The gemstone advice was detailed and well explained." }
  ],

  /* ---------- 4. YOUTUBE VIDEOS ----------
     Use the 11-character ID (…watch?v=THIS_PART) or paste a full link.
     The IDs below are SAMPLES — replace them with the client's videos. */
  videos: [
    { id: "M7lc1UVf-VE", title: "Rashifal & Weekly Predictions" },
    { id: "M7lc1UVf-VE", title: "Vastu Tips for a Peaceful Home" },
    { id: "M7lc1UVf-VE", title: "Understanding Your Kundli" }
  ],

  /* ---------- 5. SETTINGS ---------- */
  settings: {
    adminPin: "1234",                 // CHANGE THIS before going live (also changeable inside Admin → Settings)
    storageKey: "vedic_site_config_v1",
    firebase: {
      enabled: false,                 // set true after creating a Realtime Database
      databaseURL: "",                // e.g. https://your-project-default-rtdb.firebaseio.com
      path: "siteConfig",
      authToken: ""                   // optional: database secret / auth token if your rules require auth to write
    }
  }
};

/* =====================================================================
   ENGINE — storage, sync, PIN helpers.  DO NOT EDIT BELOW THIS LINE.
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG;
  var S = CFG.settings;
  var KEY = S.storageKey;
  var PIN_KEY = KEY + "_pin";
  var DATA_KEYS = ["guruji", "services", "testimonials", "videos"];

  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  function defaults() {
    var d = {};
    DATA_KEYS.forEach(function (k) { d[k] = clone(CFG[k]); });
    return d;
  }

  function normalize(raw) {
    var d = defaults();
    if (!raw || typeof raw !== "object") return d;
    if (raw.guruji && typeof raw.guruji === "object") {
      d.guruji = Object.assign({}, d.guruji, raw.guruji);
    }
    ["services", "testimonials", "videos"].forEach(function (k) {
      if (Array.isArray(raw[k])) d[k] = raw[k];
    });
    return d;
  }

  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ } }

  function load() {
    var raw = lsGet(KEY);
    if (!raw) return defaults();
    try { return normalize(JSON.parse(raw)); } catch (e) { return defaults(); }
  }

  /* ----- Firebase Realtime Database via REST (no SDK needed) ----- */
  function fbEnabled() {
    var f = S.firebase;
    return !!(f && f.enabled && f.databaseURL);
  }
  function fbUrl() {
    if (!fbEnabled()) return null;
    var f = S.firebase;
    var u = f.databaseURL.replace(/\/+$/, "") + "/" + (f.path || "siteConfig") + ".json";
    if (f.authToken) u += "?auth=" + encodeURIComponent(f.authToken);
    return u;
  }

  function pull() {
    var u = fbUrl();
    if (!u) return Promise.resolve(null);
    return fetch(u, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("Firebase read failed (" + r.status + ")");
      return r.json();
    }).then(function (j) {
      if (!j || !j.payload) return null;
      var d = normalize(JSON.parse(j.payload));
      lsSet(KEY, JSON.stringify(d));
      return d;
    });
  }

  function push(d) {
    var u = fbUrl();
    if (!u) return Promise.resolve("skipped");
    return fetch(u, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: JSON.stringify(d), updatedAt: Date.now() })
    }).then(function (r) {
      if (!r.ok) throw new Error("Firebase write failed (" + r.status + ")");
      return "ok";
    });
  }

  /* save(): always writes LocalStorage; additionally pushes to Firebase when enabled */
  function save(d) {
    var clean = normalize(d);
    var okLocal = lsSet(KEY, JSON.stringify(clean));
    if (!okLocal) return Promise.resolve({ local: false, remote: "skipped", error: "Browser storage unavailable" });
    return push(clean).then(function (res) {
      return { local: true, remote: res };
    }).catch(function (err) {
      return { local: true, remote: "error", error: err.message || String(err) };
    });
  }

  function reset() { lsDel(KEY); return defaults(); }

  /* Text block to paste over the top of config.js */
  function exportBlock(d) {
    var out = clone(CFG);
    var n = normalize(d);
    DATA_KEYS.forEach(function (k) { out[k] = n[k]; });
    return "window.SITE_CONFIG = " + JSON.stringify(out, null, 2) + ";";
  }

  /* ----- Admin PIN (client-side convenience lock only) ----- */
  function hashPin(pin) {
    var text = "vedic|" + pin;
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
        return "s:" + Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ("0" + b.toString(16)).slice(-2);
        }).join("");
      });
    }
    return Promise.resolve("b:" + btoa(unescape(encodeURIComponent(text))));
  }
  function verifyPin(pin) {
    var stored = lsGet(PIN_KEY);
    if (!stored) return Promise.resolve(String(pin) === String(S.adminPin));
    return hashPin(pin).then(function (h) { return h === stored; });
  }
  function setPin(pin) {
    return hashPin(pin).then(function (h) { lsSet(PIN_KEY, h); });
  }

  /* Built-in fallback portrait (gold "ॐ" on navy) */
  var avatarSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
    '<defs><radialGradient id="g" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1c2540"/><stop offset="1" stop-color="#090D16"/></radialGradient>' +
    '<linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1D77A"/><stop offset="1" stop-color="#A8841C"/></linearGradient></defs>' +
    '<rect width="400" height="400" fill="url(#g)"/>' +
    '<text x="200" y="260" font-size="210" text-anchor="middle" fill="url(#t)" font-family="serif">ॐ</text></svg>';

  window.SiteStore = {
    load: load,
    pull: pull,
    save: save,
    reset: reset,
    exportBlock: exportBlock,
    firebaseEnabled: fbEnabled,
    verifyPin: verifyPin,
    setPin: setPin,
    clearPin: function () { lsDel(PIN_KEY); },
    normalize: normalize,
    defaults: defaults,
    avatar: "data:image/svg+xml;utf8," + encodeURIComponent(avatarSvg)
  };
})();
