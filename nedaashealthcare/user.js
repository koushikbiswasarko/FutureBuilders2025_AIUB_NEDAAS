import { initLanguage, UserRequestsStore, escapeHtml, downloadJson, currentLang } from "./common.js";

initLanguage("btnLang");

// Network indicator
const netDot = document.getElementById("netDot");
const netText = document.getElementById("netText");
function updateNet(){
  const on = navigator.onLine;
  netDot.classList.toggle("online", on);
  netDot.classList.toggle("offline", !on);
  netText.textContent = on ? "Online" : "Offline";
}
window.addEventListener("online", updateNet);
window.addEventListener("offline", updateNet);
updateNet();

// Free vs Premium
const TIER_KEY = "nd_tier_v1";
function getTier(){ return localStorage.getItem(TIER_KEY) || "free"; }
function isPremium(){ return getTier() === "premium"; }
function showPremiumUpsell(){
  alert(currentLang === "bn"
    ? "এই ফিচারটি Premium। ডেমোর জন্য উপরে Tier থেকে Premium নির্বাচন করুন।"
    : "This feature is Premium. Switch Tier to Premium for demo."
  );
}
const tierSelect = document.getElementById("tierSelect");
tierSelect.value = getTier();
tierSelect.addEventListener("change", (e) => {
  localStorage.setItem(TIER_KEY, e.target.value);
  alert(e.target.value === "premium" ? "Premium enabled for demo." : "Free tier enabled.");
});

// WhatsApp numbers (REPLACE BEFORE DEMO; no + sign, no spaces)
const WHATSAPP_BASIC_NUMBER = "+8801318557547";
const WHATSAPP_PREMIUM_NUMBER = "+8801737050131";

// Danger signs -> auto Emergency
function anyDangerChecked(){
  return Array.from(document.querySelectorAll(".dangerChk")).some(c => c.checked);
}
function setUrgency(value){
  const radio = document.querySelector(`input[name="urgency"][value="${value}"]`);
  if (radio) radio.checked = true;
}
function updateUrgencyFromDanger(){
  const note = document.getElementById("dangerAutoNote");
  if (anyDangerChecked()){
    setUrgency("Emergency");
    note.textContent = (currentLang === "bn")
      ? "ঝুঁকিপূর্ণ লক্ষণ পাওয়া গেছে — জরুরি স্তর ‘Emergency’ করা হয়েছে।"
      : "Danger signs detected — urgency set to Emergency.";
  } else {
    note.textContent = "";
  }
}
document.querySelectorAll(".dangerChk").forEach(c => c.addEventListener("change", updateUrgencyFromDanger));

// Emergency / First aid toggles
const btnEmergency = document.getElementById("btnEmergency");
const btnFirstAid = document.getElementById("btnFirstAid");
const emergencyBox = document.getElementById("emergencyBox");
const firstAidBox = document.getElementById("firstAidBox");

btnEmergency.addEventListener("click", () => {
  emergencyBox.classList.toggle("hidden");
  firstAidBox.classList.add("hidden");
});
btnFirstAid.addEventListener("click", () => {
  firstAidBox.classList.toggle("hidden");
  emergencyBox.classList.add("hidden");
});

// GPS helper
const btnUseLocation = document.getElementById("btnUseLocation");
let gpsCache = null;

btnUseLocation.addEventListener("click", () => {
  if (!("geolocation" in navigator)) return alert("GPS not supported on this device.");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      gpsCache = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
      alert(`GPS saved: ${gpsCache.lat.toFixed(5)}, ${gpsCache.lng.toFixed(5)} (±${Math.round(gpsCache.accuracy)}m)`);
    },
    () => alert(currentLang === "bn" ? "GPS পাওয়া যায়নি। লোকেশন অন করে আবার চেষ্টা করুন।" : "Could not get GPS. Enable location and try again."),
    { enableHighAccuracy:true, timeout:8000 }
  );
});

// Save request
const helpForm = document.getElementById("helpForm");
helpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dangerSigns = Array.from(document.querySelectorAll(".dangerChk"))
    .filter(c => c.checked)
    .map(c => c.value);

  const req = {
    id: cryptoRandomId(),
    createdAt: new Date().toISOString(),
    patientName: document.getElementById("patientName").value.trim(),
    patientAge: document.getElementById("patientAge").value.trim(),
    patientPhone: document.getElementById("patientPhone").value.trim(),
    patientLocation: document.getElementById("patientLocation").value.trim(),
    problemType: document.getElementById("problemType").value,
    urgency: document.querySelector('input[name="urgency"]:checked').value,
    symptoms: document.getElementById("symptoms").value.trim(),
    dangerSigns,
    gps: gpsCache || null,
    rxRequested: false,
    rxRequestedAt: null
  };

  const list = UserRequestsStore.load();
  list.unshift(req);
  UserRequestsStore.save(list);

  helpForm.reset();
  gpsCache = null;
  document.querySelectorAll(".dangerChk").forEach(c => c.checked = false);
  updateUrgencyFromDanger();

  alert(currentLang === "bn"
    ? "সংরক্ষণ হয়েছে! অনুরোধটি এই ডিভাইসে (অফলাইন কিউ) রাখা হলো।"
    : "Saved! Request stored offline on this device."
  );
});

// View queue
const btnViewQueue = document.getElementById("btnViewQueue");
const queueBox = document.getElementById("queueBox");

btnViewQueue.addEventListener("click", () => {
  const list = UserRequestsStore.load();
  queueBox.innerHTML = list.length ? list.map(renderReq).join("") : `<p class="muted">${currentLang === "bn" ? "এখনো কোনো অনুরোধ সংরক্ষণ হয়নি।" : "No saved requests yet."}</p>`;
  queueBox.classList.toggle("hidden");
});

function renderReq(r){
  const date = new Date(r.createdAt).toLocaleString();
  const gpsText = r.gps ? `${r.gps.lat.toFixed(5)}, ${r.gps.lng.toFixed(5)}` : "N/A";
  const danger = (r.dangerSigns || []).map(escapeHtml).join(", ") || "None";
  const rx = r.rxRequested ? (currentLang === "bn" ? "অনুরোধ করা হয়েছে" : "Requested") : "—";

  return `
    <div class="dirItem">
      <h3>${escapeHtml(r.patientName)} — <span class="muted">${escapeHtml(r.urgency)}</span></h3>
      <p><strong>${currentLang === "bn" ? "সময়" : "When"}:</strong> ${escapeHtml(date)}</p>
      <p><strong>${currentLang === "bn" ? "অবস্থান" : "Location"}:</strong> ${escapeHtml(r.patientLocation)}</p>
      <p><strong>${currentLang === "bn" ? "ধরন" : "Type"}:</strong> ${escapeHtml(r.problemType)}</p>
      <p><strong>GPS:</strong> ${escapeHtml(gpsText)}</p>
      <p><strong>${currentLang === "bn" ? "ঝুঁকিপূর্ণ লক্ষণ" : "Danger signs"}:</strong> ${danger}</p>
      <p><strong>${currentLang === "bn" ? "লক্ষণ" : "Symptoms"}:</strong> ${escapeHtml(r.symptoms)}</p>
      <p><strong>${currentLang === "bn" ? "প্রেসক্রিপশন" : "Prescription"}:</strong> ${escapeHtml(rx)}</p>
    </div>
  `;
}

// Export JSON
document.getElementById("btnExport").addEventListener("click", () => {
  const list = UserRequestsStore.load();
  if (!list.length) return alert(currentLang === "bn" ? "কোন অনুরোধ নেই।" : "No requests.");
  downloadJson(`nedaashealthcare-user-requests-${new Date().toISOString().slice(0,10)}.json`, {
    exportedAt: new Date().toISOString(),
    requests: list
  });
});

// WhatsApp consulting
document.getElementById("btnWhatsApp").addEventListener("click", () => {
  const latest = UserRequestsStore.load()[0] || null;
  const msg = buildWhatsAppMessage(latest, "BASIC");
  window.location.href = `https://wa.me/${WHATSAPP_BASIC_NUMBER}?text=${encodeURIComponent(msg)}`;
});

document.getElementById("btnWhatsAppPremium").addEventListener("click", () => {
  if (!isPremium()) return showPremiumUpsell();
  const latest = UserRequestsStore.load()[0] || null;
  const msg = buildWhatsAppMessage(latest, "PREMIUM");
  window.location.href = `https://wa.me/${WHATSAPP_PREMIUM_NUMBER}?text=${encodeURIComponent(msg)}`;
});

function buildWhatsAppMessage(req, tier){
  if (!req) return `(${tier}) nedaashealthcare help needed. No saved request found. Location: [type here].`;
  const danger = (req.dangerSigns || []).join(", ") || "None";
  return [
    `(${tier}) nedaashealthcare - Medical Help Request`,
    `Name: ${req.patientName}, Age: ${req.patientAge}`,
    `Phone: ${req.patientPhone || "N/A"}`,
    `Location: ${req.patientLocation}`,
    `Problem: ${req.problemType}, Urgency: ${req.urgency}`,
    `Danger Signs: ${danger}`,
    `Symptoms: ${req.symptoms}`,
    `GPS: ${req.gps ? `${req.gps.lat}, ${req.gps.lng}` : "N/A"}`
  ].join("\n");
}

// Lab suggestions (Premium)
const btnLabSuggest = document.getElementById("btnLabSuggest");
const labBox = document.getElementById("labBox");

btnLabSuggest.addEventListener("click", () => {
  if (!isPremium()) return showPremiumUpsell();

  const symptoms = (document.getElementById("symptoms").value || "").toLowerCase();
  const problemType = (document.getElementById("problemType").value || "").toLowerCase();
  const suggestions = suggestLabs(symptoms, problemType);

  labBox.innerHTML = suggestions.length
    ? `<ul>${suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
       <p class="small">${currentLang === "bn" ? "চূড়ান্ত সিদ্ধান্ত চিকিৎসক নেবেন।" : "A clinician should confirm tests."}</p>`
    : `<p class="muted">${currentLang === "bn" ? "নির্দিষ্ট পরামর্শ নেই। অবস্থা খারাপ হলে দ্রুত চিকিৎসা নিন।" : "No specific suggestions. If severe, seek care."}</p>`;

  labBox.classList.toggle("hidden");
});

function suggestLabs(symptoms, type){
  const out = new Set();
  const has = (w) => symptoms.includes(w) || type.includes(w);

  if (has("fever") || has("জ্বর") || has("সংক্রমণ")) {
    out.add("CBC (Complete Blood Count)");
    out.add("CRP / ESR (Inflammation markers)");
  }
  if (has("cough") || has("কাশি") || has("breath") || has("শ্বাস") || has("হাঁপানি")) {
    out.add("Pulse oximetry (SpO2) if available");
    out.add("Chest X-ray (if clinician suspects pneumonia/TB)");
  }
  if (has("diarrhea") || has("ডায়রিয়া") || has("পাতলা")) {
    out.add("Stool R/E (if persistent/bloody)");
    out.add("Serum electrolytes (if severe dehydration)");
  }
  if (has("pregnancy") || has("গর্ভ") || has("মাতৃ")) {
    out.add("Hemoglobin (anemia check)");
    out.add("Urine R/E (protein/sugar)");
    out.add("Blood pressure check (pre-eclampsia screening)");
  }
  if (has("diabetes") || has("ডায়াবেটিস")) {
    out.add("Blood glucose (FBS/RBS)");
    out.add("HbA1c (long-term control)");
  }
  if (has("bp") || has("প্রেসার") || has("pressure")) {
    out.add("Blood pressure measurement");
    out.add("Serum creatinine (kidney screening if clinician suspects)");
  }
  return Array.from(out);
}

// Prescription request (Premium)
document.getElementById("btnRxRequest").addEventListener("click", () => {
  if (!isPremium()) return showPremiumUpsell();

  const list = UserRequestsStore.load();
  if (!list.length) return alert(currentLang === "bn" ? "প্রথমে অনুরোধ সংরক্ষণ করুন।" : "Save a request first.");

  list[0].rxRequested = true;
  list[0].rxRequestedAt = new Date().toISOString();
  UserRequestsStore.save(list);

  const rxBox = document.getElementById("rxBox");
  rxBox.innerHTML = `<p class="muted">${currentLang === "bn"
    ? "প্রেসক্রিপশন রিভিউ অনুরোধ করা হয়েছে। চিকিৎসকের সাথে WhatsApp/স্বাস্থ্যকর্মী মাধ্যমে যোগাযোগ করুন।"
    : "Prescription review requested. Consult a clinician via WhatsApp/health worker."}</p>`;
  rxBox.classList.remove("hidden");
});

// AI Health Assistant (Premium, safe)
document.getElementById("btnAI").addEventListener("click", () => {
  if (!isPremium()) return showPremiumUpsell();

  const q = (document.getElementById("aiQ").value || "").toLowerCase();
  const html = aiGuidance(q, anyDangerChecked());
  const box = document.getElementById("aiA");
  box.innerHTML = html;
  box.classList.remove("hidden");
});

function aiGuidance(q, danger){
  const redFlag = danger
    ? `<div class="notice danger"><strong>${currentLang === "bn" ? "রেড ফ্ল্যাগ" : "Red Flag"}:</strong> ${
        currentLang === "bn"
          ? "ঝুঁকিপূর্ণ লক্ষণ আছে। দ্রুত চিকিৎসা নিন বা WhatsApp করুন।"
          : "Danger signs present. Seek urgent care or contact WhatsApp now."
      }</div>`
    : "";

  let tips = [];
  const has = (w) => q.includes(w);

  if (has("fever") || has("জ্বর")){
    tips.push(currentLang === "bn"
      ? "পানি/ওআরএস দিন, বিশ্রাম দিন, তাপমাত্রা পর্যবেক্ষণ করুন।"
      : "Give fluids (water/ORS), rest, and monitor temperature.");
    tips.push(currentLang === "bn"
      ? "জ্বর ৪৮ ঘণ্টার বেশি থাকলে বা খুব বেশি হলে চিকিৎসকের পরামর্শ নিন।"
      : "If fever persists >48 hours or becomes very high, consult a clinician.");
  }

  if (has("breath") || has("শ্বাস") || has("asthma") || has("হাঁপানি")){
    tips.push(currentLang === "bn"
      ? "রোগীকে সোজা বসান, কাপড় ঢিলা করুন, শান্ত রাখুন।"
      : "Sit upright, loosen clothing, keep calm.");
    tips.push(currentLang === "bn"
      ? "ঠোঁট নীল, বুকব্যথা, গুরুতর শ্বাসকষ্ট হলে জরুরি চিকিৎসা নিন।"
      : "If blue lips, chest pain, or severe breathing difficulty—treat as emergency.");
  }

  if (has("diarrhea") || has("ডায়রিয়া") || has("পাতলা")){
    tips.push(currentLang === "bn"
      ? "ওআরএস বারবার দিন, শিশু হলে খাওয়ানো চালিয়ে যান।"
      : "Start ORS frequently; continue feeding for children.");
    tips.push(currentLang === "bn"
      ? "রক্ত/শ্লেষ্মা, খেতে না পারা, পানিশূন্যতা হলে দ্রুত চিকিৎসা নিন।"
      : "If blood in stool, unable to drink, or dehydration—seek urgent care.");
  }

  if (has("preg") || has("গর্ভ") || has("pregnancy")){
    tips.push(currentLang === "bn"
      ? "রক্তপাত/খিঁচুনি/চোখে ঝাপসা হলে জরুরি রেফার করুন।"
      : "If bleeding/convulsions/blurred vision—urgent referral.");
  }

  if (!tips.length){
    tips.push(currentLang === "bn"
      ? "লক্ষণ, সময়কাল, ঝুঁকিপূর্ণ লক্ষণ লিখে স্বাস্থ্যকর্মীর সাথে যোগাযোগ করুন।"
      : "Describe symptoms, duration, and danger signs, then contact a health worker.");
  }

  return `
    ${redFlag}
    <p><strong>${currentLang === "bn" ? "সাধারণ নির্দেশনা" : "General guidance"}:</strong></p>
    <ul>${tips.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>
    <p class="small">${currentLang === "bn"
      ? "এটি রোগ নির্ণয় নয়। চিকিৎসকের সিদ্ধান্তই চূড়ান্ত।"
      : "This is not a diagnosis. A clinician should decide medical actions."}</p>
  `;
}

function cryptoRandomId(){
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,"0")).join("");
}
// --- IGNORE ---