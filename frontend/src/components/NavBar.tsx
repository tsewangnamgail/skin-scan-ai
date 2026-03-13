import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, Brain, Eye, Calculator, FileText, MessageCircle, Home } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/predict", label: "Prediction", icon: Brain },
  { to: "/heatmap", label: "Heatmap", icon: Eye },
  { to: "/risk", label: "Risk Calculator", icon: Calculator },
  { to: "/report", label: "Medical Report", icon: FileText },
  { to: "/chatbot", label: "AI Chatbot", icon: MessageCircle },
];

const NavBar: React.FC = () => {
  return (
    <header className="w-full border-b border-border bg-card sticky top-0 z-20">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-lg gradient-medical p-2">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground hidden sm:inline">
            AI Skin Cancer Detection
          </span>
        </div>
        <nav className="flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "gradient-medical text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
