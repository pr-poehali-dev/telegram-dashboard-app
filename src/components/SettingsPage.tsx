import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Category = {
  id: number;
  name: string;
};

type Account = {
  id: number;
  name: string;
  currency: string;
};

const mockCategories: Category[] = [
  { id: 1, name: 'Еда' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Развлечения' },
  { id: 4, name: 'Услуги' },
];

const mockAccounts: Account[] = [
  { id: 1, name: 'Наличные', currency: 'UZS' },
  { id: 2, name: 'Карта', currency: 'UZS' },
];

export const SettingsPage = () => {
  const [language, setLanguage] = useState('ru');
  const [currency, setCurrency] = useState('UZS');
  const [timezone, setTimezone] = useState('5');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountCurrency, setNewAccountCurrency] = useState('UZS');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCategoryName }]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      setAccounts([...accounts, { id: Date.now(), name: newAccountName, currency: newAccountCurrency }]);
      setNewAccountName('');
    }
  };

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-8">
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Основные настройки</h2>
        
        <div className="space-y-2">
          <Label htmlFor="language">Язык интерфейса</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="uz">O'zbek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Валюта по умолчанию</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UZS">UZS (сум)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="RUB">RUB (₽)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Часовой пояс (UTC)</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">UTC+3</SelectItem>
              <SelectItem value="4">UTC+4</SelectItem>
              <SelectItem value="5">UTC+5</SelectItem>
              <SelectItem value="6">UTC+6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Категории</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая категория</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Название</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Например: Здоровье"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  Добавить категорию
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <span className="font-medium">{category.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Icon name="Trash2" size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Счета</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый счет</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Название</Label>
                  <Input
                    id="account-name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Например: Сбережения"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-currency">Валюта</Label>
                  <Select value={newAccountCurrency} onValueChange={setNewAccountCurrency}>
                    <SelectTrigger id="account-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UZS">UZS (сум)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="RUB">RUB (₽)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddAccount} className="w-full">
                  Добавить счет
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {accounts.map(account => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div>
                <div className="font-medium">{account.name}</div>
                <div className="text-sm text-muted-foreground">{account.currency}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteAccount(account.id)}
              >
                <Icon name="Trash2" size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
