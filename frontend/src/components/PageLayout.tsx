import React from "react";
import NavBar from "./NavBar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border py-4">
        <p className="text-xs text-muted-foreground text-center px-6">
          For educational and research purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
};

export default PageLayout;
