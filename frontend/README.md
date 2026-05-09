# MedicAI Frontend - Professional Consultation Interface

This is the premium frontend for the MediMind AI medical chatbot, built with **Next.js 15+** and designed with a focus on trust, cleanliness, and ease of use in a medical context.

## 🌟 Visual Design
- **Professional Palette**: High-contrast white theme for a clinical, trustworthy feel.
- **Typography**: Uses the **Inter** font family for maximum readability.
- **Micro-Animations**: Smooth transitions and loading states powered by **Framer Motion**.
- **Responsive Layout**: Optimized for both desktop and mobile consultations.

## 🚀 Key Modules
- **Authentication**: Custom login and registration pages integrated with the FastAPI backend.
- **Chat Engine**: Real-time streaming interface with history persistence.
- **Secure API Client**: Centralized logic for handling JWT tokens and streaming responses.
- **Sidebar**: Easy navigation between consultation threads and user settings.

## 🛠️ Getting Started

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file in the root of this directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📂 Architecture
- `/src/app`: Routes and layouts (Login, Register, Home).
- `/src/components`: UI building blocks (Sidebar, ChatMessage, Input).
- `/src/hooks`: Custom React logic for chat state and API interaction.
- `/src/lib`: Shared utilities and the core API client.

## 🏥 Medical Context
The interface includes dedicated areas for medical disclaimers and status indicators to maintain transparency with the user about AI-driven consultation.
