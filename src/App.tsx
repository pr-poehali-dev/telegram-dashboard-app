import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import WebApp from '@vkruglikov/react-telegram-web-app';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (WebApp.expand) {
      WebApp.expand();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const telegramData = {
      id: urlParams.get('id') || '',
      lang: urlParams.get('lang') || 'ru',
      key: urlParams.get('key') || '',
      username: urlParams.get('username') || 'User'
    };
    
    if (telegramData.id) {
      localStorage.setItem('telegram_data', JSON.stringify(telegramData));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;