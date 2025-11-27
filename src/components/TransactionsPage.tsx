import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

type Transaction = {
  id: number;
  type: 'income' | 'expense';
  name: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  description?: string;
};

type PeriodType = 'day' | 'week' | 'month' | 'year' | 'all';

const mockTransactions: Transaction[] = [
  { id: 1, type: 'expense', name: 'Кофе', category: 'Еда', amount: 15000, currency: 'сум', date: '2025-11-27', description: 'Утренний латте' },
  { id: 2, type: 'expense', name: 'Такси', category: 'Транспорт', amount: 25000, currency: 'сум', date: '2025-11-27', description: 'До офиса' },
  { id: 3, type: 'income', name: 'Зарплата', category: 'Доход', amount: 5000000, currency: 'сум', date: '2025-11-26' },
  { id: 4, type: 'expense', name: 'Продукты', category: 'Еда', amount: 250000, currency: 'сум', date: '2025-11-26' },
  { id: 5, type: 'expense', name: 'Интернет', category: 'Услуги', amount: 150000, currency: 'сум', date: '2025-11-25' },
  { id: 6, type: 'expense', name: 'Кино', category: 'Развлечения', amount: 50000, currency: 'сум', date: '2025-11-24' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>('week');
  const [periodOffset, setPeriodOffset] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getPeriodLabel = () => {
    const today = new Date();
    const offset = periodOffset;

    if (periodType === 'day') {
      if (offset === 0) return 'Сегодня';
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }

    if (periodType === 'week') {
      if (offset === 0) return 'Эта неделя';
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('ru-RU', { month: 'long' })}`;
    }

    if (periodType === 'month') {
      const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      if (offset === 0) return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
      return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    }

    if (periodType === 'year') {
      const year = today.getFullYear() + offset;
      if (offset === 0) return `${year} год`;
      return `${year} год`;
    }

    return 'Все время';
  };

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const key = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  }, [filteredTransactions]);

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString('ru-RU')} ${currency}`;
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск по операциям..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPeriodOffset(prev => prev - 1)}
          disabled={periodType === 'all'}
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>

        <div className="flex items-center gap-2 flex-1">
          <select
            value={periodType}
            onChange={(e) => {
              setPeriodType(e.target.value as PeriodType);
              setPeriodOffset(0);
            }}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium"
          >
            <option value="day">День</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
            <option value="all">Все время</option>
          </select>
          <span className="text-sm font-medium">{getPeriodLabel()}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setPeriodOffset(prev => prev + 1)}
          disabled={periodType === 'all' || periodOffset >= 0}
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>

      {categoryData.length > 0 && (
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">Расходы</div>
              <div className="text-2xl font-bold text-foreground">
                {formatAmount(totals.expense, 'сум')}
              </div>
              {totals.income > 0 && (
                <>
                  <div className="text-sm text-muted-foreground mt-2">Доходы</div>
                  <div className="text-xl font-semibold" style={{ color: 'hsl(var(--accent))' }}>
                    {formatAmount(totals.income, 'сум')}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, transactions]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-2">{date}</h3>
            {transactions.map(transaction => (
              <Card
                key={transaction.id}
                className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-accent/10' : 'bg-secondary'}`}>
                    <Icon
                      name={transaction.type === 'income' ? 'TrendingUp' : 'TrendingDown'}
                      size={20}
                      className={transaction.type === 'income' ? 'text-accent' : 'text-muted-foreground'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.category}</div>
                  </div>
                  <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-accent' : 'text-foreground'}`}>
                    {transaction.type === 'income' ? '+' : ''}{formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Детали операции</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Название</div>
                <div className="font-medium">{selectedTransaction.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Категория</div>
                <div className="font-medium">{selectedTransaction.category}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Сумма</div>
                <div className={`text-xl font-semibold ${selectedTransaction.type === 'income' ? 'text-accent' : 'text-foreground'}`}>
                  {selectedTransaction.type === 'income' ? '+' : ''}{formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Дата</div>
                <div className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              {selectedTransaction.description && (
                <div>
                  <div className="text-sm text-muted-foreground">Описание</div>
                  <div className="font-medium">{selectedTransaction.description}</div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">Изменить</Button>
                <Button variant="destructive" className="flex-1">Удалить</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
