import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Icon from '@/components/ui/icon';
import { TransactionsPage } from '@/components/TransactionsPage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { SettingsPage } from '@/components/SettingsPage';

const Index = () => {
  const [activePage, setActivePage] = useState<'analytics' | 'transactions' | 'settings'>('transactions');
  const [username, setUsername] = useState('User');
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const storedData = localStorage.getItem('telegram_data');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUsername(data.username || 'User');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">
            Здравствуйте, <span className="font-semibold">{username}</span>
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
          </button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6">
        {activePage === 'transactions' && <TransactionsPage />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'settings' && <SettingsPage />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => setActivePage('analytics')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activePage === 'analytics' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="PieChart" size={24} />
            <span className="text-xs font-medium">Аналитика</span>
          </button>
          
          <button
            onClick={() => setActivePage('transactions')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activePage === 'transactions' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="List" size={24} />
            <span className="text-xs font-medium">Операции</span>
          </button>
          
          <button
            onClick={() => setActivePage('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activePage === 'settings' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Settings" size={24} />
            <span className="text-xs font-medium">Настройки</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;