# 🏥 MediMind AI - Advanced Medical Chatbot

MediMind AI is a state-of-the-art medical consultation assistant designed for a Final Year Project (FYP). It leverages Large Language Models (LLMs), Agentic workflows, and real-time Geolocation to provide accurate medical information and help users find nearby healthcare facilities.

---

## 🚀 Key Features

### 1. Intelligent Medical Agent
Built using **LangGraph** and **LangChain**, the agent utilizes a "Think-Act-Observe" loop to process medical queries.
- **Serper Search**: Real-time retrieval of medical symptoms, treatments, and advice.
- **Exact Location Tools**: Dedicated tools for `serper_places` and `serper_maps` that support pinpoint coordinate searches.
- **Medical Guardrails**: System-level instructions ensure the AI remains focused on medical topics and provides necessary disclaimers.

### 2. Context-Aware Geolocation System
A custom-built, OS-style permission system handles user location with privacy in mind.
- **Smart Permissions**: Options for "Always Allow", "Only While Using", and "Don't Allow".
- **Silent Enhancement**: When granted, the system silently appends exact Latitude/Longitude to user queries, enabling the AI to find facilities "near me" without the user typing coordinates.
- **Persistence**: Remembers user preferences across sessions using `localStorage`.

### 3. Professional Next.js Frontend
A premium, high-end user interface designed for a medical context.
- **Professional Aesthetics**: Clean white background, sophisticated typography (Inter), and glassmorphic elements.
- **Real-Time Streaming**: High-speed token streaming using Server-Sent Events (SSE) for instant responses.
- **Secure Authentication**: Dedicated login and registration portals with JWT-based persistent sessions.

### 4. Robust Memory & Persistence
- **Short-Term Memory**: Uses LangGraph's `InMemorySaver` for thread-safe conversation persistence during active conversations.
- **Long-Term History**: PostgreSQL database (via Neon.tech) stores conversation history for registered users.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | Next.js 15+ (App Router), Vanilla CSS, Framer Motion, Lucide Icons |
| **Backend** | FastAPI (Python), LangChain, LangGraph |
| **LLM / AI** | Groq (Llama-3), Serper.dev (Search API) |
| **Database** | PostgreSQL (Neon DB), SQLAlchemy ORM |
| **Env Mgmt** | **UV** (Python), NPM (Node.js) |

---

## 📂 Project Structure

```bash
medical-chatbot/
├── backend/
│   ├── agents/          # Agent logic & Serper tools
│   ├── api/             # FastAPI routes & Authentication
│   ├── config/          # Environment & API settings
│   ├── db/              # Database models & base config
│   └── main_api.py      # Entry point for backend
├── frontend/            # Next.js Application
│   ├── src/app/         # App Router (Pages & Layouts)
│   ├── src/components/  # Professional UI Components
│   ├── src/lib/         # API client & Utilities
│   └── src/hooks/       # Custom React Hooks
└── .env                 # API Keys (Protected)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) (Recommended for Python environment)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a environment, then install dependencies:
   ```bash
   uv sync
   # On Windows:
   .\.venv\Scripts\activate
   ```
3. Configure your `.env` file (refer to `.env.example`).
4. Run the API:
   ```bash
   python -m main_api
   ```
   The API will start at `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variable in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔍 How Location-Aware Search Works

1. **Permission**: User is prompted via a custom modal on entry.
2. **Detection**: Browser's `navigator.geolocation` captures coordinates.
3. **Context Injection**: The frontend appends a hidden block to the user's message:
   `[User location context: Latitude: 34.0, Longitude: 72.9]`
4. **Agent Logic**: The AI agent extracts coordinates and passes them to the `serper_places` tool with `near {lat},{lng}` for pinpoint accuracy.

---

## 🗺️ Roadmap
- [ ] **Voice Integration**: Real-time voice consultation via **LiveKit Agents** and **WebRTC**.
- [ ] **Document Analysis**: Allowing users to upload medical reports for AI summary.
- [ ] **Health Dashboard**: Visualizing user symptoms over time.

---

## ⚖️ Disclaimer
*MediMind AI is a tool designed for educational and informational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider.*
