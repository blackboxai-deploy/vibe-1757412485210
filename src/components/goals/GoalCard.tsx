"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Goal } from '@/lib/types';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Hedef durumu renkleri
  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      case 'paused': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  // Hedef durumu metni
  const getStatusText = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      case 'paused': return 'Duraklatıldı';
      default: return 'Bilinmeyen';
    }
  };

  // Kategori emoji'leri
  const getCategoryEmoji = (category: Goal['category']) => {
    switch (category) {
      case 'health': return '🏥';
      case 'career': return '💼';
      case 'personal': return '🌟';
      case 'education': return '📚';
      case 'relationships': return '❤️';
      case 'finance': return '💰';
      default: return '🎯';
    }
  };

  // Öncelik renkleri
  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // İlerleme güncelleme
  const handleProgressUpdate = (newProgress: number) => {
    const updatedGoal: Goal = {
      ...goal,
      progress: newProgress,
      status: newProgress >= 100 ? 'completed' : 'active',
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedGoal);
  };

  // Durum değiştirme
  const handleStatusChange = (newStatus: Goal['status']) => {
    const updatedGoal: Goal = {
      ...goal,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedGoal);
  };

  // Milestone toggle
  const handleMilestoneToggle = (milestoneId: string) => {
    const updatedMilestones = goal.milestones.map(milestone =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            completed: !milestone.completed,
            completedAt: !milestone.completed ? new Date().toISOString() : undefined
          }
        : milestone
    );

    // İlerleme hesaplama
    const completedMilestones = updatedMilestones.filter(m => m.completed).length;
    const totalMilestones = updatedMilestones.length;
    const newProgress = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : goal.progress;

    const updatedGoal: Goal = {
      ...goal,
      milestones: updatedMilestones,
      progress: newProgress,
      status: newProgress >= 100 ? 'completed' : goal.status,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedGoal);
  };

  // Gün kaldığını hesaplama
  const getDaysLeft = () => {
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getCategoryEmoji(goal.category)}</span>
              <Badge variant="outline" className={getStatusColor(goal.status)}>
                {getStatusText(goal.status)}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${getPriorityColor(goal.priority)}`}>
                {'●'.repeat(goal.priority === 'high' ? 3 : goal.priority === 'medium' ? 2 : 1)}
              </span>
            </div>
          </div>

          <CardTitle className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {goal.title}
          </CardTitle>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* İlerleme Çubuğu */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Milestone'lar */}
          {goal.milestones && goal.milestones.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">
                Alt Hedefler ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
              </span>
              <div className="space-y-1">
                {goal.milestones.slice(0, 2).map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-1 rounded"
                    onClick={() => handleMilestoneToggle(milestone.id)}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-muted-foreground'
                    }`}>
                      {milestone.completed && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span className={`text-xs ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
                {goal.milestones.length > 2 && (
                  <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    +{goal.milestones.length - 2} daha fazla
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tarih Bilgisi */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {daysLeft > 0 ? `${daysLeft} gün kaldı` : daysLeft === 0 ? 'Bugün bitiyor' : `${Math.abs(daysLeft)} gün geçti`}
            </span>
            <span>
              {new Date(goal.targetDate).toLocaleDateString('tr-TR')}
            </span>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailsOpen(true)}
              className="flex-1"
            >
              Detaylar
            </Button>
            {goal.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('paused')}
                className="text-orange-500 hover:text-orange-600"
              >
                Duraklat
              </Button>
            )}
            {goal.status === 'paused' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('active')}
                className="text-blue-500 hover:text-blue-600"
              >
                Devam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detay Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{getCategoryEmoji(goal.category)}</span>
              <span>{goal.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Durum</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusText(goal.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Öncelik</label>
                <div className="mt-1">
                  <span className={`text-sm ${getPriorityColor(goal.priority)}`}>
                    {goal.priority === 'high' ? 'Yüksek' : goal.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Açıklama</label>
              <p className="mt-1 text-sm">{goal.description}</p>
            </div>

            {/* İlerleme Kontrolü */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                İlerleme ({goal.progress}%)
              </label>
              <div className="mt-2 space-y-2">
                <Progress value={goal.progress} className="h-3" />
                <div className="flex space-x-2">
                  {[25, 50, 75, 100].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleProgressUpdate(value)}
                      disabled={goal.status === 'completed'}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tüm Milestone'lar */}
            {goal.milestones && goal.milestones.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Alt Hedefler ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                </label>
                <div className="mt-2 space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-accent/50"
                      onClick={() => handleMilestoneToggle(milestone.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-muted-foreground'
                        }`}>
                          {milestone.completed && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                          {milestone.title}
                        </span>
                      </div>
                      {milestone.completed && milestone.completedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(milestone.completedAt).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex space-x-2">
                {goal.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('paused')}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      Duraklat
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleProgressUpdate(100)}
                      className="text-green-500 hover:text-green-600"
                    >
                      Tamamla
                    </Button>
                  </>
                )}
                {goal.status === 'paused' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('active')}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Devam Et
                  </Button>
                )}
                {goal.status === 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange('active')}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Yeniden Aktifleştir
                  </Button>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(goal.id);
                  setIsDetailsOpen(false);
                }}
              >
                Sil
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}