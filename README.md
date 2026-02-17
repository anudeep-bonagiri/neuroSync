# Neuro-Sync AI 🧠

> **The "Old Money" of Neuroscience. Minimalist. Production-Grade. Deep Insights.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production-success)

**Neuro-Sync AI** is a production-grade platform built for the **DigitalOcean Gradient™ AI Hackathon**. It ingests dense neuroscience research and clinical data, transforming it into persona-based insights and interactive 3D neural connectivity maps.

## 🚀 Features

- **Multi-Persona Intelligence**: Toggles between "Patient" (EL15, analogies) and "Researcher" (Academic, precise) modes using **Llama-3** on **Gradient**.
- **Neural Connectivity Mapping**: Extracts brain regions/pathways from text and visualizes them as a 3D interactive graph.
- **RAG-Powered Accuracy**: Cites specific papers/data points from the **DigitalOcean Knowledge Base**.
- **"Old Money" Noir Aesthetic**: A premium, distraction-free UI with deep blacks and emerald accents.

## 🏗 Architecture

```mermaid
graph TD
    User[User / Client] -->|Next.js Frontend| CDN[DigitalOcean App Platform]
    CDN -->|API Request| Backend[FastAPI Backend]
    
    subgraph "DigitalOcean Gradient™ Ecosystem"
        Backend -->|Agent SDK| Agent[Gradient Agent (Llama-3)]
        Agent -->|Retrieve Context| KB[Knowledge Base (RAG)]
        Agent -->|Extract Pathways| Tool[Neural Extraction Tool]
    end
    
    subgraph "Data Persistence"
        Backend -->|Store User History| DB[(Managed PostgreSQL)]
    end
```

## 🛠 Tech Stack

- **AI Engine**: DigitalOcean Gradient™ (ADK, Llama-3, Knowledge Bases)
- **Backend**: Python (FastAPI), Gradient Agent SDK
- **Frontend**: Next.js 14, Tailwind CSS, Three.js (React Three Fiber)
- **Database**: DigitalOcean Managed PostgreSQL
- **Infrastructure**: DigitalOcean App Platform, GitHub Actions

## ⚡️ Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- DigitalOcean Account with Gradient Access

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Set env vars: GRADIENT_ACCESS_TOKEN, GRADIENT_WORKSPACE_ID
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛡 Privacy & Ethics (HIPAA/GDPR)

**Neuro-Sync AI is designed with a "Privacy First" architecture.** 

- **In-Memory Processing**: Clinical text is processed in realtime memory and is **never persisted** to long-term storage or used for model training.
- **DigitalOcean Security**: All infrastructure runs on DigitalOcean's ISO 27001 certified data centers.
- **RAG Gating**: The system proactively refuses to answer queries with low confidence to prevent medical misinformation ("Hallucinations").

## 🌍 Potential Impact

Neuro-Sync AI democratizes access to complex neurological data. 
- **For Patients**: It demystifies diagnoses, reducing anxiety through clear, empathetic explanations.
- **For Researchers**: It accelerates discovery by visualizing hidden connections in vast datasets that human review might miss.

## 📜 License

MIT © 2024 Neuro-Sync AI Team