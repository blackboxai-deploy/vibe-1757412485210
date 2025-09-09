"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal, Milestone } from '@/lib/types';

interface AddGoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddGoalForm({ onSubmit }: AddGoalFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    targetDate: '',
    progress: 0,
    status: 'active' as Goal['status']
  });

  const [milestones, setMilestones] = useState<Omit<Milestone, 'id'>[]>([]);
  const [newMilestone, setNewMilestone] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones(prev => [...prev, {
        title: newMilestone.trim(),
        completed: false
      }]);
      setNewMilestone('');
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.targetDate) {
      return;
    }

    const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      milestones: milestones.map((milestone, index) => ({
        id: `milestone-${Date.now()}-${index}`,
        ...milestone
      }))
    };

    onSubmit(goalData);
  };

  // Minimum tarih (bugün)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Başlık */}
      <div className="space-y-2">
        <Label htmlFor="title">Hedef Başlığı *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Örn: Günde 10.000 adım atmak"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
      </div>

      {/* Açıklama */}
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          placeholder="Hedefiniz hakkında detaylı bilgi..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      {/* Kategori ve Öncelik */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={(value: Goal['category']) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">🏥 Sağlık</SelectItem>
              <SelectItem value="career">💼 Kariyer</SelectItem>
              <SelectItem value="personal">🌟 Kişisel</SelectItem>
              <SelectItem value="education">📚 Eğitim</SelectItem>
              <SelectItem value="relationships">❤️ İlişkiler</SelectItem>
              <SelectItem value="finance">💰 Finans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Öncelik</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Goal['priority']) => handleInputChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Düşük</SelectItem>
              <SelectItem value="medium">🟡 Orta</SelectItem>
              <SelectItem value="high">🔴 Yüksek</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hedef Tarih */}
      <div className="space-y-2">
        <Label htmlFor="targetDate">Hedef Tarih *</Label>
        <Input
          id="targetDate"
          type="date"
          min={today}
          value={formData.targetDate}
          onChange={(e) => handleInputChange('targetDate', e.target.value)}
          required
        />
      </div>

      {/* Alt Hedefler */}
      <div className="space-y-2">
        <Label>Alt Hedefler (Milestone'lar)</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Yeni alt hedef ekle..."
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMilestone();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddMilestone}
            disabled={!newMilestone.trim()}
          >
            Ekle
          </Button>
        </div>

        {/* Milestone Listesi */}
        {milestones.length > 0 && (
          <div className="space-y-2 mt-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-accent/20 rounded-lg"
              >
                <span className="text-sm">{milestone.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMilestone(index)}
                  className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Butonları */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={!formData.title.trim() || !formData.targetDate}>
          <span className="mr-2">🎯</span>
          Hedef Oluştur
        </Button>
      </div>
    </form>
  );
}