const LANG_KEY = "nd_lang_v3";

export const APP = "NEDAAS HealthCare";
export const currentLang = () => localStorage.getItem(LANG_KEY) || "bn"; // default Bangla
export const setLang = (lng) => localStorage.setItem(LANG_KEY, lng);

export const TEXT = {
  en: {
    "toggle.bn": "বাংলা",
    "toggle.en": "English",
    "net.online": "Online",
    "net.offline": "Offline",

    "tier.free": "Free",
    "tier.premium": "Premium",

    "nav.admin": "Admin Portal",
    "nav.user": "User Portal",

    "theme.btn": "Dark Mode",

    "user.subtitle": "Offline-first medical help for rural & hill regions",
    "user.badge": "User Portal",

    "admin.subtitle": "Admin Dashboard (triage + directory + notes)",
    "admin.badge": "Admin Portal",

    "admin.dash": "Admin Dashboard",
    "admin.import": "Import Cases (JSON)",
    "admin.exportdb": "Export Admin Database (JSON)",

    "admin.dir.title": "Manage Offline Directory",
    "admin.dir.desc": "Store verified contacts for offline use.",
    "admin.dir.name": "Name",
    "admin.dir.name.ph": "e.g., Upazila Health Complex",
    "admin.dir.area": "Area",
    "admin.dir.area.ph": "e.g., Rangamati",
    "admin.dir.phone": "Phone/Contact",
    "admin.dir.phone.ph": "e.g., 01XXXXXXXXX",
    "admin.dir.note": "Note",
    "admin.dir.note.ph": "e.g., Emergency referral",
    "admin.dir.add": "Add Directory Entry",

    "admin.cases.title": "Case List (Imported)",
    "admin.cases.desc": "Import JSON exported from User Portal.",
    "admin.cases.export": "Export Case List",
    "admin.cases.clear": "Clear Case List",

    "login.title": "Admin Login",
    "login.desc": "Use demo credentials to access the admin portal.",
    "login.user": "Username",
    "login.pass": "Password",
    "login.btn": "Login",
    "login.logout": "Logout",
    "login.cancel": "Cancel",

    "danger.title": "Danger Signs Checklist",
    "danger.desc": "If any are checked, urgency automatically becomes Emergency.",
    "danger.preg.title": "Pregnancy",
    "danger.preg.1": "Heavy bleeding",
    "danger.preg.2": "Convulsion / fainting",
    "danger.preg.3": "Severe headache / blurred vision",
    "danger.preg.4": "No fetal movement",
    "danger.child.title": "Child",
    "danger.child.1": "Unconscious / very sleepy",
    "danger.child.2": "Not drinking / repeated vomiting",
    "danger.child.3": "Fast breathing / chest indrawing",
    "danger.child.4": "Convulsion",
    "danger.breath.title": "Breathing & Severe",
    "danger.breath.1": "Blue lips / severe breathing",
    "danger.breath.2": "Chest pain / heart warning",
    "danger.breath.3": "Severe injury / bleeding",

    "req.title": "Medical Help Request",
    "req.desc": "Works offline. Saved on this device. Later share by WhatsApp or JSON export.",

    "form.name.label": "Patient Name",
    "form.name.ph": "e.g., Rahima Begum",
    "form.age.label": "Age",
    "form.age.ph": "e.g., 35",
    "form.phone.label": "Phone (optional)",
    "form.phone.ph": "e.g., 01XXXXXXXXX",
    "form.loc.label": "Location (village/union)",
    "form.loc.ph": "e.g., Sajek, Rangamati",
    "form.type.label": "Problem Type",
    "form.type.select": "Select…",
    "type.1": "Fever / infection",
    "type.2": "Pregnancy / maternal",
    "type.3": "Child health",
    "type.4": "Injury / accident",
    "type.5": "Breathing / asthma",
    "type.6": "Diarrhea / dehydration",
    "type.7": "Chronic (diabetes/BP)",
    "type.8": "Other",

    "form.urg.label": "Urgency",
    "urg.1": "Normal",
    "urg.2": "Urgent",
    "urg.3": "Emergency",

    "form.sym.label": "Symptoms Details",
    "form.sym.ph": "Write what happened, when it started, danger signs etc.",

    "btn.save": "Save Request (Offline)",
    "btn.gps": "Add GPS",
    "btn.view": "View Saved Requests",
    "btn.export": "Export JSON (Share)",

    "live.title": "Live Consulting",
    "live.desc": "If WhatsApp signal exists, contact a health worker instantly.",
    "btn.wa.free": "WhatsApp (Free)",
    "btn.wa.premium": "Premium: Doctor Call",
    "live.note": "Even weak internet may work if WhatsApp works.",

    "lab.title": "Lab Test Suggestions (General)",
    "lab.desc": "General guidance only—not diagnosis. A clinician confirms final tests.",
    "btn.lab": "Get Suggestions (Premium)",

    "rx.title": "Prescription",
    "rx.desc": "Only licensed doctors can issue prescriptions. You can request a review.",
    "btn.rx": "Request Prescription Review (Premium)",

    "aidoc.title": "AI Doctor (ChatGPT)",
    "aidoc.desc": "Opens ChatGPT for AI-based guidance. Not a replacement for doctors.",
    "btn.chatgpt": "Open ChatGPT",

    "sos.title": "Emergency & First Aid",
    "btn.emg": "Emergency Numbers",
    "btn.fa": "First Aid",
    "sos.emg.h": "Emergency Numbers (Bangladesh)",
    "sos.emg.1": "National Emergency",
    "sos.emg.2": "Health Hotline",
    "sos.emg.3": "Govt Info Service",

    "sos.fa.h": "First Aid (Offline)",
    "sos.fa.t1": "Bleeding:",
    "sos.fa.1": "Press firmly with clean cloth.",
    "sos.fa.t2": "Fever:",
    "sos.fa.2": "Give water/ORS, rest, keep cool.",
    "sos.fa.t3": "Breathing:",
    "sos.fa.3": "Sit upright, loosen clothing.",
    "sos.fa.t4": "Snake bite:",
    "sos.fa.4": "Keep limb still. No cutting/sucking.",
    "sos.fa.t5": "Unconscious:",
    "sos.fa.5": "Arrange urgent transport to facility.",

    "footer": "NEDAAS HealthCare | Offline-first | Built for hill tracts & rural Bangladesh",

    "msg.premiumOnly": "This feature is Premium. Switch Tier to Premium for demo.",
    "msg.saved": "Saved! Request stored offline on this device.",
    "msg.noReq": "No saved requests yet.",
    "msg.noReqShort": "No requests.",
    "msg.gpsFail": "Could not get GPS. Enable location and try again.",
    "msg.importOk": "Imported cases successfully.",
    "msg.importFail": "Import failed: invalid JSON.",
    "msg.clearConfirm": "Clear all cases?",
    "msg.loginFail": "Incorrect username or password."
  },

  bn: {
    "toggle.bn": "English",
    "toggle.en": "বাংলা",
    "net.online": "অনলাইন",
    "net.offline": "অফলাইন",

    "tier.free": "ফ্রি",
    "tier.premium": "প্রিমিয়াম",

    "nav.admin": "অ্যাডমিন পোর্টাল",
    "nav.user": "ইউজার পোর্টাল",

    "theme.btn": "ডার্ক মোড",

    "user.subtitle": "গ্রাম ও পাহাড়ি অঞ্চলের জন্য অফলাইন-ভিত্তিক স্বাস্থ্য সহায়তা",
    "user.badge": "ইউজার পোর্টাল",

    "admin.subtitle": "অ্যাডমিন ড্যাশবোর্ড (ট্রায়াজ + ডিরেক্টরি + নোটস)",
    "admin.badge": "অ্যাডমিন পোর্টাল",

    "admin.dash": "অ্যাডমিন ড্যাশবোর্ড",
    "admin.import": "কেস ইমপোর্ট (JSON)",
    "admin.exportdb": "অ্যাডমিন ডাটাবেজ এক্সপোর্ট (JSON)",

    "admin.dir.title": "অফলাইন ডিরেক্টরি ম্যানেজ করুন",
    "admin.dir.desc": "অফলাইনে ব্যবহারের জন্য যাচাইকৃত কন্টাক্ট সংরক্ষণ করুন।",
    "admin.dir.name": "নাম",
    "admin.dir.name.ph": "উদাহরণ: উপজেলা স্বাস্থ্য কমপ্লেক্স",
    "admin.dir.area": "এলাকা",
    "admin.dir.area.ph": "উদাহরণ: রাঙামাটি",
    "admin.dir.phone": "ফোন/কন্টাক্ট",
    "admin.dir.phone.ph": "উদাহরণ: 01XXXXXXXXX",
    "admin.dir.note": "নোট",
    "admin.dir.note.ph": "উদাহরণ: জরুরি রেফারাল",
    "admin.dir.add": "ডিরেক্টরিতে যোগ করুন",

    "admin.cases.title": "কেস তালিকা (ইমপোর্টেড)",
    "admin.cases.desc": "ইউজার পোর্টাল থেকে এক্সপোর্ট করা JSON ইমপোর্ট করুন।",
    "admin.cases.export": "কেস তালিকা এক্সপোর্ট",
    "admin.cases.clear": "কেস তালিকা মুছুন",

    "login.title": "অ্যাডমিন লগইন",
    "login.desc": "অ্যাডমিন পোর্টালে প্রবেশ করতে ডেমো ক্রেডেনশিয়াল ব্যবহার করুন।",
    "login.user": "ইউজারনেম",
    "login.pass": "পাসওয়ার্ড",
    "login.btn": "লগইন",
    "login.logout": "লগআউট",
    "login.cancel": "বাতিল",

    "danger.title": "ঝুঁকিপূর্ণ লক্ষণ চেকলিস্ট",
    "danger.desc": "যেকোনো লক্ষণ টিক দিলে জরুরি স্তর স্বয়ংক্রিয়ভাবে ‘Emergency’ হবে।",
    "danger.preg.title": "গর্ভাবস্থা",
    "danger.preg.1": "অতিরিক্ত রক্তপাত",
    "danger.preg.2": "খিঁচুনি / অজ্ঞান",
    "danger.preg.3": "তীব্র মাথাব্যথা / চোখে ঝাপসা",
    "danger.preg.4": "বাচ্চা নড়াচড়া না করা",
    "danger.child.title": "শিশু",
    "danger.child.1": "অচেতন / খুব ঘুমঘুম",
    "danger.child.2": "খেতে না পারা / বারবার বমি",
    "danger.child.3": "দ্রুত শ্বাস / বুক দেবে যাওয়া",
    "danger.child.4": "খিঁচুনি",
    "danger.breath.title": "শ্বাস ও গুরুতর অবস্থা",
    "danger.breath.1": "ঠোঁট নীল / তীব্র শ্বাসকষ্ট",
    "danger.breath.2": "বুকব্যথা / সন্দেহজনক হার্ট সমস্যা",
    "danger.breath.3": "মারাত্মক আঘাত / রক্তপাত",

    "req.title": "চিকিৎসা সহায়তা অনুরোধ",
    "req.desc": "অফলাইনে কাজ করে। এই ডিভাইসে সেভ হবে। পরে WhatsApp বা JSON দিয়ে শেয়ার করুন।",

    "form.name.label": "রোগীর নাম",
    "form.name.ph": "উদাহরণ: রহিমা বেগম",
    "form.age.label": "বয়স",
    "form.age.ph": "উদাহরণ: ৩৫",
    "form.phone.label": "মোবাইল (যদি থাকে)",
    "form.phone.ph": "উদাহরণ: 01XXXXXXXXX",
    "form.loc.label": "অবস্থান (গ্রাম/ইউনিয়ন)",
    "form.loc.ph": "উদাহরণ: সাজেক, রাঙামাটি",
    "form.type.label": "সমস্যার ধরন",
    "form.type.select": "নির্বাচন করুন…",
    "type.1": "জ্বর / সংক্রমণ",
    "type.2": "গর্ভাবস্থা / মাতৃস্বাস্থ্য",
    "type.3": "শিশু স্বাস্থ্য",
    "type.4": "আঘাত / দুর্ঘটনা",
    "type.5": "শ্বাসকষ্ট / হাঁপানি",
    "type.6": "ডায়রিয়া / পানিশূন্যতা",
    "type.7": "দীর্ঘমেয়াদি (ডায়াবেটিস/প্রেসার)",
    "type.8": "অন্যান্য",

    "form.urg.label": "জরুরি স্তর",
    "urg.1": "সাধারণ",
    "urg.2": "জরুরি",
    "urg.3": "অতিজরুরি",

    "form.sym.label": "লক্ষণ বিস্তারিত লিখুন",
    "form.sym.ph": "কী হয়েছে, কখন শুরু হয়েছে, ঝুঁকিপূর্ণ কিছু থাকলে লিখুন…",

    "btn.save": "অনুরোধ সংরক্ষণ করুন (Offline)",
    "btn.gps": "GPS যোগ করুন",
    "btn.view": "সংরক্ষিত অনুরোধ দেখুন",
    "btn.export": "JSON এক্সপোর্ট (শেয়ার)",

    "live.title": "লাইভ কনসাল্টিং",
    "live.desc": "WhatsApp সিগন্যাল থাকলে এক ট্যাপে স্বাস্থ্যকর্মীর সাথে যোগাযোগ করুন।",
    "btn.wa.free": "WhatsApp (ফ্রি)",
    "btn.wa.premium": "প্রিমিয়াম: ডাক্তার কল",
    "live.note": "নেট দুর্বল হলেও WhatsApp কাজ করলে মেসেজ যাবে।",

    "lab.title": "ল্যাব টেস্ট পরামর্শ (সাধারণ)",
    "lab.desc": "এটি রোগ নির্ণয় নয়—সাধারণ গাইডলাইন। চিকিৎসক চূড়ান্ত টেস্ট ঠিক করবেন।",
    "btn.lab": "পরামর্শ নিন (প্রিমিয়াম)",

    "rx.title": "প্রেসক্রিপশন",
    "rx.desc": "শুধুমাত্র লাইসেন্সপ্রাপ্ত চিকিৎসক প্রেসক্রিপশন দিতে পারেন। আপনি রিভিউ অনুরোধ করতে পারবেন।",
    "btn.rx": "প্রেসক্রিপশন রিভিউ অনুরোধ (প্রিমিয়াম)",

    "aidoc.title": "এআই ডাক্তার (ChatGPT)",
    "aidoc.desc": "ChatGPT ওপেন করে AI গাইডলাইন নিন। এটি ডাক্তারের বিকল্প নয়।",
    "btn.chatgpt": "ChatGPT খুলুন",

    "sos.title": "জরুরি সহায়তা ও প্রাথমিক চিকিৎসা",
    "btn.emg": "জরুরি নম্বর",
    "btn.fa": "প্রাথমিক চিকিৎসা",
    "sos.emg.h": "জরুরি নম্বর (বাংলাদেশ)",
    "sos.emg.1": "জাতীয় জরুরি সেবা",
    "sos.emg.2": "স্বাস্থ্য বাতায়ন",
    "sos.emg.3": "সরকারি তথ্য সেবা",

    "sos.fa.h": "প্রাথমিক চিকিৎসা (অফলাইনে)",
    "sos.fa.t1": "রক্তপাত:",
    "sos.fa.1": "পরিষ্কার কাপড় দিয়ে শক্ত করে চাপ দিন।",
    "sos.fa.t2": "জ্বর:",
    "sos.fa.2": "পানি/ওআরএস দিন, বিশ্রাম দিন, শরীর ঠান্ডা রাখুন।",
    "sos.fa.t3": "শ্বাসকষ্ট:",
    "sos.fa.3": "সোজা বসান, কাপড় ঢিলা করুন।",
    "sos.fa.t4": "সাপের কামড়:",
    "sos.fa.4": "অঙ্গ স্থির রাখুন, কাটা/বিষ টানা নয়।",
    "sos.fa.t5": "অজ্ঞান:",
    "sos.fa.5": "দ্রুত স্বাস্থ্যকেন্দ্রে নেওয়ার ব্যবস্থা করুন।",

    "footer": "NEDAAS HealthCare | Offline-first | Hill tracts & rural Bangladesh",

    "msg.premiumOnly": "এই ফিচারটি প্রিমিয়াম। ডেমোর জন্য Tier থেকে Premium নির্বাচন করুন।",
    "msg.saved": "সংরক্ষণ হয়েছে! অনুরোধটি এই ডিভাইসে (অফলাইন কিউ) রাখা হলো।",
    "msg.noReq": "এখনো কোনো অনুরোধ সংরক্ষণ হয়নি।",
    "msg.noReqShort": "কোন অনুরোধ নেই।",
    "msg.gpsFail": "GPS পাওয়া যায়নি। লোকেশন অন করে আবার চেষ্টা করুন।",
    "msg.importOk": "কেস সফলভাবে ইমপোর্ট হয়েছে।",
    "msg.importFail": "ইমপোর্ট ব্যর্থ: JSON সঠিক নয়।",
    "msg.clearConfirm": "সব কেস মুছে ফেলবেন?",
    "msg.loginFail": "ইউজারনেম বা পাসওয়ার্ড ভুল।"
  }
};

export function tr(key){
  const lang = currentLang();
  return TEXT[lang]?.[key] ?? TEXT.en[key] ?? key;
}

export function applyI18n(){
  const lang = currentLang();

  const toggle = document.getElementById("btnLang");
  if (toggle){
    toggle.textContent = (lang === "bn") ? TEXT.bn["toggle.bn"] : TEXT.en["toggle.bn"];
  }

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = tr(k);
  });

  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const k = el.getAttribute("data-i18n-ph");
    el.setAttribute("placeholder", tr(k));
  });
}

export function toggleLang(){
  const lang = currentLang();
  setLang(lang === "bn" ? "en" : "bn");
  location.reload();
}

export function downloadJson(filename, obj){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

export function makeStore(key){
  return {
    load(){
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      try { return JSON.parse(raw); } catch { return []; }
    },
    save(list){ localStorage.setItem(key, JSON.stringify(list)); },
    clear(){ localStorage.removeItem(key); }
  };
}

export const UserRequestsStore = makeStore("nd_user_requests_v3");
export const AdminDirectoryStore = makeStore("nd_admin_directory_v3");
export const AdminCasesStore = makeStore("nd_admin_cases_v3");
