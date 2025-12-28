# HillCare Offline  
**FutureBuilders2025_AIUB_NEDAAS**

## Team Information
**Team Name:** AIUB_NEDAAS  
**Event:** FutureBuilders2025  

**Team Members:**  
- Koushik Biswas Arko  
- Arizit Chaki Artha  
- S. F. Sheikh Saadi  

---

## Problem Statement
### The Silent Struggle: Why Medical Support in Bangladesh’s Hill Tracts and Rural Regions Remains Hard to Find

In Bangladesh’s hill tracts and remote rural areas, access to healthcare is a persistent challenge. Many communities are separated from medical facilities by long distances, poor road infrastructure, rivers, and difficult terrain. Internet connectivity is unreliable or completely unavailable, making digital health solutions ineffective in emergencies.

As a result, preventable illnesses escalate into life-threatening conditions due to delayed diagnosis, lack of guidance, and difficulty contacting healthcare providers.

---

## Solution Overview
**HillCare Offline** is an **AI-powered, offline-first healthcare support application** designed specifically for low-connectivity environments.

The application enables:
- **Offline symptom-based triage** using AI logic
- **Risk assessment (Low / Medium / High)** with clear guidance
- **Offline clinic directory** with distance calculation (GPS-based when available)
- **SMS-based help requests** to health workers or clinics
- **Bilingual support (English & Bangla)** for accessibility

The solution runs fully offline and only relies on SMS and GPS when available, making it suitable for rural and hill-tract regions.

---

## Application Type
- **Mobile Application**
- Built using **Python + Kivy**
- No hardware prototypes used (as per rules)

---

## AI Integration (MANDATORY)
This project includes **mandatory AI integration** through:

- **Rule-based AI triage engine**
  - Symptom scoring
  - Emergency condition detection
  - Risk classification logic
- **Explainable AI**
  - Transparent decision rules
  - No black-box inference (important for healthcare trust)
- **AI-driven decision support**
  - Guides patients on urgency and next steps
  - Assists health workers via structured SMS summaries

Solutions without AI are disqualified; HillCare Offline directly embeds AI into its core healthcare logic.

---

## Technologies Used
- **Programming Language:** Python  
- **Framework:** Kivy (Cross-platform UI)  
- **Database:** SQLite (`hillcare.db`)  
- **AI Logic:** Offline rule-based decision engine  
- **Optional Mobile Features:**  
  - GPS (via Plyer)  
  - SMS (via Plyer – Android only)  

---

## AI Tools Disclosure (MANDATORY)
The following AI tools were used during development:

- **ChatGPT** – Used for:
  - Code assistance
  - AI triage logic design
  - Debugging support
  - README preparation

> No other AI tools were used beyond those listed above.

---

## Handling Limited Internet Access
HillCare Offline is specifically designed for environments with **limited or no internet access**:

- All symptom data, rules, and clinic information are **bundled locally**
- AI triage runs **entirely offline**
- SQLite database stores help requests locally
- GPS is optional and degrades gracefully if unavailable
- SMS is used instead of internet-based communication
- No cloud APIs or real-time online dependencies

---

## Key Features
- Offline symptom triage with risk assessment
- Emergency condition detection
- Nearby clinic listing with distance calculation
- SMS help request generation and sending
- English & Bangla language support
- Offline data persistence

---

## Repository Structure
```text
.
├── main.py           # Main Kivy application
├── hillcare.db       # Local SQLite database
├── clinics.json      # Offline clinic directory
├── symptoms.json     # Symptom definitions & AI rules
├── README.md
