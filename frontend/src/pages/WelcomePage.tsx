import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Brain,
  Eye,
  FileText,
  Calculator,
  MessageCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Prediction",
    desc: "Deep learning model classifies skin lesions with high accuracy",
  },
  {
    icon: Eye,
    title: "Grad-CAM Heatmap",
    desc: "Explainable AI shows which regions influenced the prediction",
  },
  {
    icon: FileText,
    title: "AI Medical Report",
    desc: "Auto-generated clinical summary ready for download",
  },
  {
    icon: Calculator,
    title: "Risk Calculator",
    desc: "Personalized risk assessment based on clinical factors",
  },
  {
    icon: MessageCircle,
    title: "Skin Cancer Chatbot",
    desc: "AI-powered Q&A about skin cancer symptoms and prevention",
  },
];

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-medical opacity-[0.03]" />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 mb-6">
            <Activity className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-secondary-foreground">
              Powered by Deep Learning
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            AI Skin Cancer Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload a dermoscopic image and receive an AI-powered diagnosis with
            explainable heatmaps, risk assessment, and a downloadable medical
            report — all in one place.
          </p>
          <button
            onClick={() => navigate("/predict")}
            className="inline-flex items-center gap-2 gradient-medical text-primary-foreground font-semibold px-8 py-3.5 rounded-lg shadow-elevated hover:opacity-90 transition-opacity text-base"
          >
            Start Analysis
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-8">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="rounded-lg gradient-medical p-2.5 w-fit mb-3">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-2xl font-bold text-foreground">222+</span>
          </div>
          <p className="text-muted-foreground text-base">
            Years of Skin Cancer Research →{" "}
            <span className="font-semibold text-foreground">
              Your AI Diagnostic Tool
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-4">
        <p className="text-xs text-muted-foreground text-center px-6">
          For educational and research purposes only. Not a substitute for
          professional medical advice.
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
