export const APP_NAME = "nedaashealthcare";

// Language
const LANG_KEY = "nd_lang_v1";
export let currentLang = localStorage.getItem(LANG_KEY) || "en";

const I18N = {
  en: {
    appTitle: "nedaashealthcare",
    subtitle: "Offline-first medical help for rural & hill regions",
    langBtn: "বাংলা"
  },
  bn: {
    appTitle: "nedaashealthcare",
    subtitle: "গ্রাম ও পাহাড়ি অঞ্চলের জন্য অফলাইন-ভিত্তিক স্বাস্থ্য সহায়তা",
    langBtn: "English"
  }
};

export function t(key){
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

export function initLanguage(btnId){
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.textContent = t("langBtn");
  btn.addEventListener("click", () => {
    currentLang = (currentLang === "en") ? "bn" : "en";
    localStorage.setItem(LANG_KEY, currentLang);
    location.reload();
  });

  const title = document.getElementById("appTitle");
  const sub = document.getElementById("appSubtitle");
  if (title) title.textContent = t("appTitle");
  if (sub) sub.textContent = t("subtitle");
}

export function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
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

export function makeStore(key){
  return {
    load(){
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      try { return JSON.parse(raw); } catch { return []; }
    },
    save(list){
      localStorage.setItem(key, JSON.stringify(list));
    },
    clear(){
      localStorage.removeItem(key);
    }
  };
}

export const UserRequestsStore = makeStore("nd_user_requests_v1");
export const AdminDirectoryStore = makeStore("nd_admin_directory_v1");
export const AdminCasesStore = makeStore("nd_admin_cases_v1");
export const HWCasesStore = makeStore("nd_hw_cases_v1");