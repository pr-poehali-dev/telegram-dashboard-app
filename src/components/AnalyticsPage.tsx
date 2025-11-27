import { Card } from '@/components/ui/card';

export const AnalyticsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">📊</div>
          <h2 className="text-2xl font-semibold">Раздел в разработке</h2>
          <p className="text-muted-foreground">
            Здесь скоро появится детальная аналитика ваших трат
          </p>
        </div>
      </Card>
    </div>
  );
};
