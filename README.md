# AI Skin Cancer Detection System 🩺🔬

An end-to-end medical AI application that utilizes deep learning to detect potential skin cancer from images and provides an intelligent RAG (Retrieval-Augmented Generation) chatbot for dermatological guidance.

## 🚀 Key Features

- **AI Inference**: Uses a fine-tuned EfficientNet-B0 model trained on the HAM10000 dataset to classify skin lesions across 7 categories.
- **Explainable AI (Heatmap)**: Generates Grad-CAM visualizations to show exactly where the model is looking on the skin.
- **RAG Chatbot**: A smart assistant powered by **Groq (Llama 3.1)** and **ChromaDB**. It retrieves medical context from curated dermatology textbooks to answer user queries with high accuracy.
- **Advanced Risk Assessment**: Calculates patient-specific risk scores by combining AI probability with clinical factors like age, skin type, and medical history.
- **Instant Reports**: Generates downloadable screening reports for users to share with their healthcare providers.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ML Engine**: TensorFlow & Keras
- **LLM/RAG**: LangChain, Groq API, Sentence Transformers (all-MiniLM-L6-v2)
- **Vector DB**: ChromaDB
- **Package Management**: `uv`

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS (Lucide Icons, Framer Motion)
- **State Management**: React Hooks & Context API

---

## 🏃‍♂️ How to Run Locally

### 1. Prerequisites
- [uv](https://github.com/astral-sh/uv) installed (for backend)
- [Node.js](https://nodejs.org/) (for frontend)
- A [Groq API Key](https://console.groq.com/)

### 2. Backend Setup
```bash
cd backend
# Install dependencies
uv sync
# Create a .env file and add your GROQ_API_KEY
echo "GROQ_API_KEY=your_key_here" > .env
# Run the server
uv run uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Run the dev server
npm run dev
```

---

## 📂 Project Structure

```bash
skin-scan-ai/
├── backend/
│   ├── app/                # FastAPI application source
│   │   ├── api/            # API routes (predict, chatbot, risk, etc.)
│   │   ├── models/         # ML inference and model loading
│   │   ├── rag/            # Vector store, embeddings, and agent logic
│   │   └── services/       # Core business & calculation logic
│   ├── knowledge/          # PDF textbooks for RAG
│   └── model/              # Trained Keras models (.keras)
└── frontend/               # React application source
```

---

## ⚠️ Medical Disclaimer

**This application is for educational and screening purposes ONLY.** It is not a diagnostic tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

**Developed by:** [Your Name/Team]
**Dataset:** HAM10000 - "Human Against Machine with 10000 training images"
