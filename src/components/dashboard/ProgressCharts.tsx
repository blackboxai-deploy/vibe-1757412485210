"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Goal, Habit, JournalEntry } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer
} from 'recharts';

interface ProgressChartsProps {
  goals: Goal[];
  habits: Habit[];
  journalEntries: JournalEntry[];
}

export function ProgressCharts({ goals, habits, journalEntries }: ProgressChartsProps) {
  // Hedef kategorileri analizi
  const goalsByCategory = goals.reduce((acc, goal) => {
    acc[goal.category] = (acc[goal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goalCategoryData = Object.entries(goalsByCategory).map(([category, count]) => ({
    name: getCategoryName(category),
    value: count,
    color: getCategoryColor(category)
  }));

  // Alışkanlık kategori analizi
  const habitsByCategory = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const habitCategoryData = Object.entries(habitsByCategory).map(([category, count]) => ({
    name: getCategoryName(category),
    value: count,
    color: getCategoryColor(category)
  }));

  // Son 7 günlük aktivite analizi
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const weeklyActivity = last7Days.map(date => {
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(date)
    ).length;
    
    const journalCount = journalEntries.filter(entry => 
      entry.date === date
    ).length;

    const dayName = new Date(date).toLocaleDateString('tr-TR', { weekday: 'short' });
    
    return {
      day: dayName,
      date: date,
      alışkanlıklar: completedHabits,
      günlük: journalCount,
      toplam: completedHabits + journalCount
    };
  });

  // Ruh hali analizi
  const moodData = journalEntries
    .filter(entry => entry.mood)
    .reduce((acc, entry) => {
      const moodLabel = getMoodLabel(entry.mood);
      acc[moodLabel] = (acc[moodLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const moodAnalysis = Object.entries(moodData).map(([mood, count]) => ({
    name: mood,
    value: count,
    color: getMoodColor(mood)
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">İlerleme Analizi</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hedef Kategorileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Hedef Kategorileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goalCategoryData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={goalCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {goalCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2">
                  {goalCategoryData.map((item) => (
                    <Badge key={item.name} variant="outline" style={{ color: item.color }}>
                      {item.name}: {item.value}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Henüz hedef eklenmemiş</p>
            )}
          </CardContent>
        </Card>

        {/* Alışkanlık Kategorileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✅</span>
              <span>Alışkanlık Kategorileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {habitCategoryData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={habitCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {habitCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2">
                  {habitCategoryData.map((item) => (
                    <Badge key={item.name} variant="outline" style={{ color: item.color }}>
                      {item.name}: {item.value}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Henüz alışkanlık eklenmemiş</p>
            )}
          </CardContent>
        </Card>

        {/* Haftalık Aktivite */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Son 7 Günlük Aktivite</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Gün: ${label}`}
                />
                <Bar 
                  dataKey="alışkanlıklar" 
                  fill="#10B981" 
                  name="Tamamlanan Alışkanlıklar"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="günlük" 
                  fill="#8B5CF6" 
                  name="Günlük Girişleri"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ruh Hali Analizi */}
        {moodAnalysis.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>😊</span>
                <span>Ruh Hali Dağılımı</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={moodAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {moodAnalysis.map((entry, index) => (
                        <Cell key={`mood-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {moodAnalysis.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-accent/20">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.value} gün</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Yardımcı fonksiyonlar
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    health: 'Sağlık',
    career: 'Kariyer',
    personal: 'Kişisel',
    education: 'Eğitim',
    relationships: 'İlişkiler',
    finance: 'Finans',
    productivity: 'Verimlilik',
    mindfulness: 'Bilinçlilik',
    learning: 'Öğrenme',
    fitness: 'Fitness',
    social: 'Sosyal'
  };
  return categoryNames[category] || category;
}

function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    health: '#10B981',
    career: '#3B82F6',
    personal: '#8B5CF6',
    education: '#F59E0B',
    relationships: '#EF4444',
    finance: '#06B6D4',
    productivity: '#6366F1',
    mindfulness: '#10B981',
    learning: '#8B5CF6',
    fitness: '#EF4444',
    social: '#F59E0B'
  };
  return categoryColors[category] || '#6B7280';
}

function getMoodLabel(mood: number): string {
  const moodLabels: Record<number, string> = {
    1: 'Çok Kötü',
    2: 'Kötü',
    3: 'Orta',
    4: 'İyi',
    5: 'Mükemmel'
  };
  return moodLabels[mood] || 'Bilinmeyen';
}

function getMoodColor(mood: string): string {
  const moodColors: Record<string, string> = {
    'Çok Kötü': '#EF4444',
    'Kötü': '#F97316',
    'Orta': '#EAB308',
    'İyi': '#22C55E',
    'Mükemmel': '#10B981'
  };
  return moodColors[mood] || '#6B7280';
}