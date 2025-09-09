"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserStats } from '@/lib/types';

interface StatsOverviewProps {
  stats: UserStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  progress?: number;
  color?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, progress, color = 'rgb(59, 130, 246)', trend }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Arka Plan Gradyenti */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <Progress 
              value={progress} 
              className="h-2"
              style={{ 
                background: `${color}20`,
              }}
            />
            <div className="text-xs text-muted-foreground">
              %{progress} tamamlandı
            </div>
          </div>
        )}

        {trend && (
          <div className="flex items-center space-x-1">
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const goalsCompletionRate = stats.totalGoals > 0 
    ? Math.round((stats.completedGoals / stats.totalGoals) * 100) 
    : 0;

  const averageStreak = stats.activeHabits > 0 
    ? Math.round(stats.totalStreak / stats.activeHabits) 
    : 0;

  const statsCards: StatCardProps[] = [
    {
      title: 'Toplam Hedefler',
      value: stats.totalGoals,
      subtitle: `${stats.completedGoals} tamamlandı`,
      icon: '🎯',
      progress: goalsCompletionRate,
      color: 'rgb(34, 197, 94)',
      trend: {
        value: stats.completedGoals,
        label: 'bu ay',
        isPositive: stats.completedGoals > 0
      }
    },
    {
      title: 'Aktif Alışkanlıklar',
      value: stats.activeHabits,
      subtitle: `Ort. ${averageStreak} gün streak`,
      icon: '✅',
      color: 'rgb(59, 130, 246)',
      trend: {
        value: averageStreak,
        label: 'ortalama',
        isPositive: averageStreak > 3
      }
    },
    {
      title: 'Toplam Streak',
      value: stats.totalStreak,
      subtitle: `${stats.activeHabits} alışkanlık`,
      icon: '🔥',
      color: 'rgb(239, 68, 68)',
      trend: {
        value: Math.max(0, stats.totalStreak - 50), // Örnek trend hesaplaması
        label: 'bu hafta',
        isPositive: stats.totalStreak > 10
      }
    },
    {
      title: 'Günlük Girişleri',
      value: stats.journalEntries,
      subtitle: 'toplam giriş',
      icon: '📝',
      color: 'rgb(139, 92, 246)',
      trend: {
        value: Math.min(stats.journalEntries, 7), // Son 7 gün tahmini
        label: 'bu hafta',
        isPositive: stats.journalEntries > 0
      }
    },
    {
      title: 'Tamamlanan Kaynaklar',
      value: stats.resourcesCompleted,
      subtitle: 'gelişim materyali',
      icon: '📚',
      color: 'rgb(245, 158, 11)',
      trend: {
        value: stats.resourcesCompleted,
        label: 'tamamlandı',
        isPositive: stats.resourcesCompleted > 0
      }
    },
    {
      title: 'Genel Skor',
      value: calculateOverallScore(stats),
      subtitle: 'gelişim puanı',
      icon: '⭐',
      progress: Math.min(calculateOverallScore(stats), 100),
      color: 'rgb(236, 72, 153)',
      trend: {
        value: 15, // Örnek artış
        label: 'bu ay',
        isPositive: true
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">İstatistikler</h2>
        <div className="text-sm text-muted-foreground">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <StatCard 
            key={index} 
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            progress={card.progress}
            color={card.color}
            trend={card.trend}
          />
        ))}
      </div>
    </div>
  );
}

// Genel skor hesaplama fonksiyonu
function calculateOverallScore(stats: UserStats): number {
  let score = 0;
  
  // Hedef tamamlama oranı (40 puan max)
  if (stats.totalGoals > 0) {
    score += (stats.completedGoals / stats.totalGoals) * 40;
  }
  
  // Alışkanlık skoru (30 puan max)
  if (stats.activeHabits > 0) {
    const avgStreak = stats.totalStreak / stats.activeHabits;
    score += Math.min(avgStreak * 3, 30);
  }
  
  // Günlük girişi skoru (20 puan max)
  score += Math.min(stats.journalEntries * 2, 20);
  
  // Kaynak tamamlama skoru (10 puan max)
  score += Math.min(stats.resourcesCompleted * 2, 10);
  
  return Math.round(score);
}