"use client";

import { useState } from 'react';
import { Navigation } from '@/components/common/Navigation';
import { GoalCard } from '@/components/goals/GoalCard';
import { AddGoalForm } from '@/components/goals/AddGoalForm';
import { useAppState } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Goal } from '@/lib/types';

export default function GoalsPage() {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { appState, isLoading, updateGoals } = useAppState();

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

  const goals = appState.goals || [];
  
  // Hedefleri duruma göre filtrele
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const pausedGoals = goals.filter(goal => goal.status === 'paused');

  // Hedef ekleme
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateGoals(prev => [...prev, newGoal]);
    setIsAddDialogOpen(false);
  };

  // Hedef güncelleme
  const handleUpdateGoal = (updatedGoal: Goal) => {
    updateGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id 
        ? { ...updatedGoal, updatedAt: new Date().toISOString() }
        : goal
    ));
  };

  // Hedef silme
  const handleDeleteGoal = (goalId: string) => {
    updateGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // İstatistikler
  const stats = {
    total: goals.length,
    active: activeGoals.length,
    completed: completedGoals.length,
    paused: pausedGoals.length,
    completionRate: goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0
  };

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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hedeflerim</h1>
              <p className="text-muted-foreground">
                Kişisel gelişim hedeflerinizi belirleyin ve takip edin
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <span className="mr-2">🎯</span>
                  Yeni Hedef Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni Hedef Ekle</DialogTitle>
                </DialogHeader>
                <AddGoalForm onSubmit={handleAddGoal} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Toplam Hedef</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Aktif</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Tamamlandı</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">%{stats.completionRate}</div>
                <div className="text-sm text-muted-foreground">Başarı Oranı</div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Aktif ({stats.active})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2">
                <span>✅</span>
                <span>Tamamlandı ({stats.completed})</span>
              </TabsTrigger>
              <TabsTrigger value="paused" className="flex items-center space-x-2">
                <span>⏸️</span>
                <span>Duraklatıldı ({stats.paused})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {activeGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Henüz aktif hedef yok
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      İlk hedefini ekleyerek kişisel gelişim yolculuğuna başla!
                    </p>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <span className="mr-2">➕</span>
                          İlk Hedefini Ekle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Yeni Hedef Ekle</DialogTitle>
                        </DialogHeader>
                        <AddGoalForm onSubmit={handleAddGoal} />
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {completedGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Henüz tamamlanmış hedef yok
                    </h3>
                    <p className="text-muted-foreground">
                      Hedeflerini tamamlayarak burada başarılarını kutlayabilirsin!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="paused" className="space-y-6">
              {pausedGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pausedGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Duraklatılmış hedef yok
                    </h3>
                    <p className="text-muted-foreground">
                      Gerektiğinde hedeflerini duraklatıp daha sonra devam edebilirsin.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}