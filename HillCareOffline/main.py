import json
import math
import os
import sqlite3
from datetime import datetime

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput

# Optional (Android features). App still runs without these on PC.
try:
    from plyer import gps
    from plyer import sms
    PLYER_AVAILABLE = True
except Exception:
    PLYER_AVAILABLE = False

DB_NAME = "hillcare.db"

TRANSLATIONS = {
    "en": {
        "title": "HillCare Offline (Python/Kivy)\nOffline Triage + Nearby Clinics + SMS Help",
        "lang_en": "English",
        "lang_bn": "বাংলা",
        "btn_triage": "1) Symptom Triage",
        "btn_clinics": "2) Nearby Clinics",
        "btn_help": "3) Send Help Request (SMS)",
        "home_text": (
            "How to demo:\n"
            "• Symptom Triage -> pick symptoms -> get risk guidance\n"
            "• Nearby Clinics -> see nearest facilities (GPS if available)\n"
            "• Send Help Request -> generate SMS text to a health worker\n\n"
            "Works offline. Clinics/symptoms are bundled locally."
        ),
        "triage_hint": "Select symptoms (offline). Then press 'Get Guidance'.",
        "get_guidance": "Get Guidance",
        "triage_note": "Note: This is not a doctor. If emergency signs exist, go immediately.",
        "clinics_title": "Nearby Clinics (offline directory). Uses GPS if available; otherwise shows all.",
        "help_title": "Create a help request. App will store it locally and prepare an SMS message.",
        "name": "Patient name",
        "age": "Age",
        "phone": "Patient phone (optional)",
        "worker": "Health worker / clinic phone to SMS (e.g. 01XXXXXXXXX)",
        "symptoms_prompt": "Write symptoms (or use Triage first and copy key symptoms):",
        "symptoms_hint": "Example: fever, cough, chest pain",
        "generate_sms": "Generate SMS Text + Save Offline",
        "send_sms": "Send SMS Now (Android only)",
        "sms_pc_mode": "SMS sending is available on Android build only (PC mode now).",
        "missing_worker_or_text": "Missing worker number or SMS text.",
        "sms_opened": "SMS app opened for sending (confirm send on phone).",
        "sms_failed": "Could not open SMS sender:",
        "gps_on": "GPS: ON",
        "gps_off": "GPS: OFF",
        "sms_on": "SMS: ON",
        "sms_off": "SMS: OFF (PC mode)",
        "file_missing": "File missing or invalid:",
        "symptoms_not_loaded": (
            "Symptoms list is empty.\n"
            "Check that symptoms.json exists next to main.py and is valid JSON.\n"
            "Also ensure Windows didn't rename it to symptoms.json.txt"
        ),
        "risk_high": "HIGH",
        "risk_medium": "MEDIUM",
        "risk_low": "LOW",
        "risk_label": "Risk:",
        "guidance_label": "Guidance:",
        "guidance_high": (
            "Go to the nearest health facility NOW or call for urgent transport. "
            "If possible, send an SMS help request from the app."
        ),
        "guidance_medium": (
            "Seek medical advice within 24 hours. If travel is hard, send an SMS help request. "
            "Keep hydrated and monitor warning signs."
        ),
        "guidance_low": (
            "Home care may be enough: rest, hydration, observe symptoms. "
            "If symptoms worsen, use the app again or visit a clinic."
        ),
        "help_request_title": "HELP REQUEST (HillCare Offline)",
        "need_line": "Need: Advice / Referral / Transport",
        "location_unknown": "Unknown",
    },
    "bn": {
        "title": "HillCare অফলাইন (Python/Kivy)\nঅফলাইন ট্রায়াজ + নিকটস্থ ক্লিনিক + SMS সহায়তা",
        "lang_en": "English",
        "lang_bn": "বাংলা",
        "btn_triage": "১) উপসর্গ ট্রায়াজ",
        "btn_clinics": "২) নিকটস্থ ক্লিনিক",
        "btn_help": "৩) সহায়তা অনুরোধ (SMS)",
        "home_text": (
            "ডেমো করার নিয়ম:\n"
            "• উপসর্গ ট্রায়াজ -> উপসর্গ নির্বাচন -> ঝুঁকি অনুযায়ী পরামর্শ\n"
            "• নিকটস্থ ক্লিনিক -> কাছাকাছি চিকিৎসাকেন্দ্র (GPS থাকলে দূরত্ব)\n"
            "• সহায়তা অনুরোধ -> স্বাস্থ্যকর্মীর কাছে SMS বার্তা তৈরি\n\n"
            "ইন্টারনেট ছাড়াই কাজ করে। সব ডাটা অ্যাপের ভিতরেই থাকে।"
        ),
        "triage_hint": "উপসর্গ নির্বাচন করুন (ইন্টারনেট ছাড়াই)। তারপর 'গাইডেন্স' চাপুন।",
        "get_guidance": "গাইডেন্স দেখুন",
        "triage_note": "নোট: এটি ডাক্তার নয়। জরুরি লক্ষণ থাকলে দ্রুত নিকটস্থ হাসপাতালে যান।",
        "clinics_title": "নিকটস্থ ক্লিনিক (অফলাইন তালিকা)। GPS থাকলে দূরত্ব দেখাবে, না থাকলে সব দেখাবে।",
        "help_title": "সহায়তা অনুরোধ তৈরি করুন। অ্যাপ অফলাইনে সংরক্ষণ করবে এবং SMS বার্তা তৈরি করবে।",
        "name": "রোগীর নাম",
        "age": "বয়স",
        "phone": "রোগীর ফোন (ঐচ্ছিক)",
        "worker": "স্বাস্থ্যকর্মী/ক্লিনিক নম্বর (SMS পাঠাতে)",
        "symptoms_prompt": "উপসর্গ লিখুন (অথবা ট্রায়াজ থেকে কপি করুন):",
        "symptoms_hint": "উদাহরণ: জ্বর, কাশি, বুক ব্যথা",
        "generate_sms": "SMS তৈরি + অফলাইনে সেভ",
        "send_sms": "এখন SMS পাঠান (শুধু Android)",
        "sms_pc_mode": "SMS পাঠানো শুধু Android-এ কাজ করে (এখন PC মোড)।",
        "missing_worker_or_text": "স্বাস্থ্যকর্মীর নম্বর বা SMS টেক্সট নেই।",
        "sms_opened": "SMS অ্যাপ খুলেছে (ফোনে গিয়ে পাঠানো কনফার্ম করুন)।",
        "sms_failed": "SMS পাঠানো যায়নি:",
        "gps_on": "GPS: ON",
        "gps_off": "GPS: OFF",
        "sms_on": "SMS: ON",
        "sms_off": "SMS: OFF (PC মোড)",
        "file_missing": "ফাইল পাওয়া যায়নি বা ভুল:",
        "symptoms_not_loaded": (
            "উপসর্গ তালিকা খালি।\n"
            "main.py এর পাশে symptoms.json আছে কিনা দেখুন এবং JSON ঠিক আছে কিনা দেখুন।\n"
            "Windows অনেক সময় symptoms.json.txt করে ফেলে—সেটা ঠিক করুন।"
        ),
        "risk_high": "উচ্চ ঝুঁকি",
        "risk_medium": "মাঝারি ঝুঁকি",
        "risk_low": "কম ঝুঁকি",
        "risk_label": "ঝুঁকি:",
        "guidance_label": "পরামর্শ:",
        "guidance_high": (
            "এখনই নিকটস্থ হাসপাতালে/চিকিৎসাকেন্দ্রে যান অথবা জরুরি পরিবহন ব্যবস্থা করুন। "
            "সম্ভব হলে অ্যাপ থেকে SMS সহায়তা অনুরোধ পাঠান।"
        ),
        "guidance_medium": (
            "২৪ ঘন্টার মধ্যে চিকিৎসকের পরামর্শ নিন। যাতায়াত কঠিন হলে SMS সহায়তা অনুরোধ পাঠান। "
            "পানি পান করুন এবং সতর্ক লক্ষণ দেখুন।"
        ),
        "guidance_low": (
            "বাড়িতে বিশ্রাম, পানি পান, লক্ষণ পর্যবেক্ষণ করুন। "
            "লক্ষণ বাড়লে আবার ট্রায়াজ করুন বা ক্লিনিকে যান।"
        ),
        "help_request_title": "সহায়তা অনুরোধ (HillCare অফলাইন)",
        "need_line": "প্রয়োজন: পরামর্শ / রেফারেল / পরিবহন",
        "location_unknown": "অজানা",
    }
}


def haversine_km(lat1, lon1, lat2, lon2):
    """Distance between two points on Earth (km). Offline-friendly."""
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


class HillCareRoot(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation="vertical", padding=10, spacing=10, **kwargs)

        self.user_lat = None
        self.user_lon = None

        # Language
        self.lang = "en"

        def t(key):
            return TRANSLATIONS.get(self.lang, TRANSLATIONS["en"]).get(key, key)

        self.t = t

        # Load local data
        self.clinics = self.load_json("clinics.json", default=[])
        self.symptoms_cfg = self.load_json("symptoms.json", default={"symptoms": [], "rules": []})

        self.init_db()

        # Header
        self.header = Label(text=self.t("title"), size_hint_y=None, height=80)
        self.add_widget(self.header)

        # Language toggle row
        lang_row = BoxLayout(size_hint_y=None, height=40, spacing=10)
        btn_en = Button(text=self.t("lang_en"))
        btn_bn = Button(text=self.t("lang_bn"))
        btn_en.bind(on_press=lambda *_: self.set_lang("en"))
        btn_bn.bind(on_press=lambda *_: self.set_lang("bn"))
        lang_row.add_widget(btn_en)
        lang_row.add_widget(btn_bn)
        self.add_widget(lang_row)

        # Top buttons
        btn_row = BoxLayout(size_hint_y=None, height=50, spacing=10)
        self.btn_triage = Button(text=self.t("btn_triage"))
        self.btn_clinics = Button(text=self.t("btn_clinics"))
        self.btn_help = Button(text=self.t("btn_help"))
        btn_row.add_widget(self.btn_triage)
        btn_row.add_widget(self.btn_clinics)
        btn_row.add_widget(self.btn_help)
        self.add_widget(btn_row)

        self.btn_triage.bind(on_press=self.show_triage)
        self.btn_clinics.bind(on_press=self.show_clinics)
        self.btn_help.bind(on_press=self.show_help)

        # Main content area
        self.content = BoxLayout(orientation="vertical")
        self.add_widget(self.content)

        # Status bar
        self.status = Label(text=self.get_status_text(), size_hint_y=None, height=30)
        self.add_widget(self.status)

        # Start GPS if possible
        if PLYER_AVAILABLE:
            self.start_gps()

        self.show_home()

    def set_lang(self, lang_code):
        self.lang = lang_code

        # Update visible top UI
        self.header.text = self.t("title")
        self.btn_triage.text = self.t("btn_triage")
        self.btn_clinics.text = self.t("btn_clinics")
        self.btn_help.text = self.t("btn_help")

        # Refresh screen (simple approach)
        self.show_home()

    def load_json(self, filename, default):
        # Ensure we load relative to main.py location (important for packaging)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default

    def init_db(self):
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS help_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age TEXT,
                phone TEXT,
                selected_symptoms TEXT,
                risk_level TEXT,
                lat REAL,
                lon REAL,
                created_at TEXT
            )
        """)
        conn.commit()
        conn.close()

    def save_request(self, name, age, phone, selected_symptoms, risk_level):
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO help_requests (name, age, phone, selected_symptoms, risk_level, lat, lon, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name, age, phone,
            ", ".join(selected_symptoms),
            risk_level,
            self.user_lat, self.user_lon,
            datetime.utcnow().isoformat()
        ))
        conn.commit()
        conn.close()

    def get_status_text(self):
        gps_text = self.t("gps_on") if (self.user_lat is not None and self.user_lon is not None) else self.t("gps_off")
        sms_text = self.t("sms_on") if PLYER_AVAILABLE else self.t("sms_off")
        return f"Status — {gps_text} | {sms_text}"

    # ---------------- GPS ----------------
    def start_gps(self):
        try:
            gps.configure(on_location=self.on_location, on_status=self.on_gps_status)
            gps.start(minTime=1000, minDistance=1)
        except Exception:
            pass

    def on_location(self, **kwargs):
        self.user_lat = kwargs.get("lat")
        self.user_lon = kwargs.get("lon")
        self.status.text = self.get_status_text()

    def on_gps_status(self, stype, status):
        self.status.text = self.get_status_text()

    # ---------------- UI Helpers ----------------
    def set_content(self, widget):
        self.content.clear_widgets()
        self.content.add_widget(widget)

    def show_home(self, *_):
        box = BoxLayout(orientation="vertical", spacing=10)
        box.add_widget(Label(text=self.t("home_text")))

        # Warn if symptoms didn't load
        if not self.symptoms_cfg.get("symptoms"):
            box.add_widget(Label(text=self.t("symptoms_not_loaded")))

        self.set_content(box)

    # ---------------- TRIAGE ----------------
    def show_triage(self, *_):
        outer = BoxLayout(orientation="vertical", spacing=10)

        outer.add_widget(Label(text=self.t("triage_hint"), size_hint_y=None, height=40))

        scroll = ScrollView()
        grid = GridLayout(cols=1, spacing=5, size_hint_y=None)
        grid.bind(minimum_height=grid.setter("height"))

        self.symptom_buttons = {}
        symptoms = self.symptoms_cfg.get("symptoms", [])
        if not symptoms:
            grid.add_widget(Label(text=self.t("symptoms_not_loaded"), size_hint_y=None, height=120))
        else:
            for s in symptoms:
                sym_name = s.get("name", "")
                btn = Button(text=f"[ ] {sym_name}", size_hint_y=None, height=45)
                btn.sym_selected = False
                btn.bind(on_press=self.toggle_symptom)
                self.symptom_buttons[btn] = sym_name
                grid.add_widget(btn)

        scroll.add_widget(grid)
        outer.add_widget(scroll)

        btn_get = Button(text=self.t("get_guidance"), size_hint_y=None, height=50)
        result_lbl = Label(text="", size_hint_y=None, height=140)
        btn_get.bind(on_press=lambda *_: self.run_triage(result_lbl))
        outer.add_widget(btn_get)
        outer.add_widget(result_lbl)

        note = Label(text=self.t("triage_note"), size_hint_y=None, height=40)
        outer.add_widget(note)

        self.set_content(outer)

    def toggle_symptom(self, btn):
        btn.sym_selected = not getattr(btn, "sym_selected", False)
        name = self.symptom_buttons[btn]
        btn.text = ("[x] " if btn.sym_selected else "[ ] ") + name

    def run_triage(self, result_lbl):
        selected = [name for btn, name in self.symptom_buttons.items() if getattr(btn, "sym_selected", False)]
        risk, guidance = self.triage_logic(selected)
        result_lbl.text = f"{self.t('risk_label')} {risk}\n\n{self.t('guidance_label')}\n{guidance}"

    def triage_logic(self, selected_symptoms):
        """
        Simple, explainable rules-based triage.
        Edit symptoms.json to improve.
        """
        rules = self.symptoms_cfg.get("rules", [])

        score = 0
        emergency = False

        symptom_map = {s.get("name"): s for s in self.symptoms_cfg.get("symptoms", [])}
        for sym in selected_symptoms:
            cfg = symptom_map.get(sym, {})
            score += int(cfg.get("score", 0))
            if cfg.get("emergency", False):
                emergency = True

        for r in rules:
            required = set(r.get("if_all", []))
            if required and required.issubset(set(selected_symptoms)):
                score += int(r.get("add_score", 0))
                if r.get("emergency", False):
                    emergency = True

        if emergency or score >= 8:
            return (self.t("risk_high"), self.t("guidance_high"))
        if score >= 4:
            return (self.t("risk_medium"), self.t("guidance_medium"))
        return (self.t("risk_low"), self.t("guidance_low"))

    # ---------------- CLINICS ----------------
    def show_clinics(self, *_):
        outer = BoxLayout(orientation="vertical", spacing=10)
        outer.add_widget(Label(text=self.t("clinics_title"), size_hint_y=None, height=60))

        scroll = ScrollView()
        grid = GridLayout(cols=1, spacing=8, size_hint_y=None)
        grid.bind(minimum_height=grid.setter("height"))

        clinic_list = [dict(c) for c in self.clinics]  # copy

        if self.user_lat is not None and self.user_lon is not None:
            for c in clinic_list:
                try:
                    c["distance_km"] = haversine_km(self.user_lat, self.user_lon, c["lat"], c["lon"])
                except Exception:
                    c["distance_km"] = None
            clinic_list.sort(key=lambda x: x.get("distance_km") if x.get("distance_km") is not None else 10**9)

        if not clinic_list:
            grid.add_widget(Label(text="No clinics loaded. Check clinics.json.", size_hint_y=None, height=60))
        else:
            for c in clinic_list:
                dist = ""
                if c.get("distance_km") is not None:
                    dist = f" — {c['distance_km']:.1f} km"
                txt = (
                    f"{c.get('name','N/A')}{dist}\n"
                    f"Phone: {c.get('phone','N/A')}\n"
                    f"Area: {c.get('area','N/A')}"
                )
                grid.add_widget(Label(text=txt, size_hint_y=None, height=90))

        scroll.add_widget(grid)
        outer.add_widget(scroll)
        self.set_content(outer)

    # ---------------- HELP REQUEST ----------------
    def show_help(self, *_):
        outer = BoxLayout(orientation="vertical", spacing=10)
        outer.add_widget(Label(text=self.t("help_title"), size_hint_y=None, height=60))

        self.in_name = TextInput(hint_text=self.t("name"), multiline=False, size_hint_y=None, height=45)
        self.in_age = TextInput(hint_text=self.t("age"), multiline=False, size_hint_y=None, height=45)
        self.in_phone = TextInput(hint_text=self.t("phone"), multiline=False, size_hint_y=None, height=45)
        self.in_worker = TextInput(hint_text=self.t("worker"), multiline=False, size_hint_y=None, height=45)

        outer.add_widget(self.in_name)
        outer.add_widget(self.in_age)
        outer.add_widget(self.in_phone)
        outer.add_widget(self.in_worker)

        outer.add_widget(Label(text=self.t("symptoms_prompt"), size_hint_y=None, height=40))
        self.in_symptoms = TextInput(hint_text=self.t("symptoms_hint"), multiline=True)
        outer.add_widget(self.in_symptoms)

        self.out_sms = TextInput(text="", readonly=True, multiline=True, size_hint_y=None, height=160)
        outer.add_widget(self.out_sms)

        btn_gen = Button(text=self.t("generate_sms"), size_hint_y=None, height=50)
        btn_send = Button(text=self.t("send_sms"), size_hint_y=None, height=50)

        btn_gen.bind(on_press=self.generate_sms)
        btn_send.bind(on_press=self.send_sms_now)

        outer.add_widget(btn_gen)
        outer.add_widget(btn_send)

        self.set_content(outer)

    def generate_sms(self, *_):
        name = self.in_name.text.strip()
        age = self.in_age.text.strip()
        phone = self.in_phone.text.strip()
        symptoms_text = self.in_symptoms.text.strip()

        # Split by comma for triage scoring; also keep original
        selected_symptoms = [s.strip() for s in symptoms_text.split(",") if s.strip()]

        risk, _ = self.triage_logic(selected_symptoms)

        latlon = self.t("location_unknown")
        if self.user_lat is not None and self.user_lon is not None:
            latlon = f"{self.user_lat:.5f},{self.user_lon:.5f}"

        sms_text = (
            f"{self.t('help_request_title')}\n"
            f"Name: {name}\nAge: {age}\nPhone: {phone}\n"
            f"Symptoms: {', '.join(selected_symptoms) if selected_symptoms else symptoms_text}\n"
            f"{self.t('risk_label')} {risk}\n"
            f"Location(GPS): {latlon}\n"
            f"{self.t('need_line')}"
        )

        # Save locally (offline record)
        self.save_request(name, age, phone, selected_symptoms, risk)

        self.out_sms.text = sms_text

        worker = self.in_worker.text.strip()
        if not worker:
            self.out_sms.text += "\n\n(Please add a health worker/clinic phone number to send via SMS.)"

    def send_sms_now(self, *_):
        if not PLYER_AVAILABLE:
            self.out_sms.text += f"\n\n{self.t('sms_pc_mode')}"
            return

        worker = self.in_worker.text.strip()
        text = self.out_sms.text.strip()

        if not worker or not text:
            self.out_sms.text += f"\n\n{self.t('missing_worker_or_text')}"
            return

        try:
            sms.send(recipient=worker, message=text)
            self.out_sms.text += f"\n\n{self.t('sms_opened')}"
        except Exception as e:
            self.out_sms.text += f"\n\n{self.t('sms_failed')} {e}"


class HillCareApp(App):
    def build(self):
        return HillCareRoot()


if __name__ == "__main__":
    HillCareApp().run()
