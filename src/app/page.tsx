"use client";

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/common/Navigation';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { MotivationalQuote } from '@/components/common/MotivationalQuote';
import { useAppState } from '@/hooks/useLocalStorage';
import { sampleGoals, sampleHabits, sampleJournalEntries, sampleResources } from '@/lib/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const { appState, isLoading, updateAppState } = useAppState();

  // İlk kez yüklendiğinde örnek verileri ekle
  useEffect(() => {
    if (!isLoading && appState.goals.length === 0) {
      updateAppState(() => ({
        goals: sampleGoals,
        habits: sampleHabits,
        journalEntries: sampleJournalEntries,
        resources: sampleResources,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [isLoading, appState.goals.length, updateAppState]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalGoals: appState.goals.length,
    completedGoals: appState.goals.filter(g => g.status === 'completed').length,
    activeHabits: appState.habits.filter(h => h.isActive).length,
    totalStreak: appState.habits.reduce((sum, h) => sum + h.streak, 0),
    journalEntries: appState.journalEntries.length,
    resourcesCompleted: appState.resources.filter(r => r.isCompleted).length,
  };

  // Son hedefler
  const recentGoals = appState.goals
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Bugünkü alışkanlıklar
  const today = new Date().toISOString().split('T')[0];
  const todayHabits = appState.habits
    .filter(h => h.isActive)
    .map(habit => ({
      ...habit,
      completedToday: habit.completedDates.includes(today)
    }));

  // Son günlük girişleri
  const recentJournalEntries = appState.journalEntries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        isCollapsed={isNavigationCollapsed}
        onToggle={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Kişisel gelişim yolculuğunuzun genel görünümü
            </p>
          </div>

          {/* Motivational Quote */}
          <MotivationalQuote />

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Progress Charts */}
          <ProgressCharts 
            goals={appState.goals}
            habits={appState.habits}
            journalEntries={appState.journalEntries}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Son Hedefler</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentGoals.length > 0 ? (
                  recentGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                        </div>
                      </div>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status === 'completed' ? 'Tamamlandı' : 'Aktif'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Henüz hedef eklenmemiş</p>
                )}
                <Button className="w-full" variant="outline" size="sm">
                  Tüm Hedefleri Görüntüle
                </Button>
              </CardContent>
            </Card>

            {/* Today's Habits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Bugünkü Alışkanlıklar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayHabits.length > 0 ? (
                  todayHabits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{ 
                            borderColor: habit.color,
                            backgroundColor: habit.completedToday ? habit.color : 'transparent'
                          }}
                        >
                          {habit.completedToday && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{habit.name}</h4>
                          <p className="text-xs text-muted-foreground">🔥 {habit.streak} gün</p>
                        </div>
                      </div>
                      <Badge variant={habit.completedToday ? 'default' : 'outline'}>
                        {habit.completedToday ? 'Tamamlandı' : 'Bekliyor'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Aktif alışkanlık bulunamadı</p>
                )}
                <Button className="w-full" variant="outline" size="sm">
                  Tüm Alışkanlıkları Görüntüle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Journal Entries */}
          {recentJournalEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📝</span>
                  <span>Son Günlük Girişleri</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJournalEntries.map((entry) => (
                  <div key={entry.id} className="p-4 bg-accent/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{entry.title}</h4>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: entry.mood }).map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {entry.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(entry.date).toLocaleDateString('tr-TR')}</span>
                      {entry.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {entry.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline" size="sm">
                  Tüm Günlük Girişlerini Görüntüle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}