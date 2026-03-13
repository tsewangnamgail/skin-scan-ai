import React from "react";
import { MessageCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Chatbot from "@/components/Chatbot";

const ChatbotPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg gradient-medical p-2.5">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Skin Cancer Chatbot</h1>
            <p className="text-sm text-muted-foreground">Ask questions about skin cancer symptoms, prevention, and more</p>
          </div>
        </div>
        <Chatbot />
      </div>
    </PageLayout>
  );
};

export default ChatbotPage;
