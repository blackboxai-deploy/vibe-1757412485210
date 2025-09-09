// Örnek veriler ve motivasyonel içerik
import { Goal, Habit, JournalEntry, Resource, QuoteData } from './types';

// Örnek hedefler
export const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Günde 10.000 Adım Atmak',
    description: 'Sağlığımı geliştirmek için günlük 10.000 adım hedefine ulaşmak istiyorum.',
    category: 'health',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 gün sonra
    progress: 75,
    status: 'active',
    priority: 'high',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: [
      { id: '1-1', title: '7 gün üst üste hedefi tuttur', completed: true, completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '1-2', title: '30 gün üst üste hedefi tuttur', completed: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '1-3', title: '60 gün üst üste hedefi tuttur', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Yeni Dil Öğrenmek',
    description: 'İngilizcemi geliştirip akıcı konuşabilmek için günlük pratik yapmak.',
    category: 'education',
    targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 ay sonra
    progress: 45,
    status: 'active',
    priority: 'medium',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: [
      { id: '2-1', title: 'Temel kelimeler (500 kelime)', completed: true, completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2-2', title: 'Basit cümleler kurabilme', completed: true, completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '2-3', title: 'Konuşma pratiği (1000 kelime)', completed: false },
      { id: '2-4', title: 'Akıcı konuşma seviyesi', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Kitap Okuma Alışkanlığı',
    description: 'Ayda en az 2 kitap okuyarak kendimi geliştirmek istiyorum.',
    category: 'personal',
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 yıl sonra
    progress: 60,
    status: 'active',
    priority: 'medium',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: [
      { id: '3-1', title: 'İlk ay 2 kitap', completed: true, completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '3-2', title: 'İkinci ay 2 kitap', completed: true, completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: '3-3', title: 'Üçüncü ay 2 kitap', completed: false },
      { id: '3-4', title: 'Yılda 24 kitap hedefi', completed: false }
    ]
  }
];

// Örnek alışkanlıklar
export const sampleHabits: Habit[] = [
  {
    id: '1',
    name: 'Meditasyon',
    description: 'Günlük 10 dakika meditasyon yaparak zihinsel sağlığımı güçlendiriyorum.',
    frequency: 'daily',
    streak: 12,
    completedDates: generateCompletedDates(12, 'daily'),
    category: 'mindfulness',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Su İçmek',
    description: 'Günde 8 bardak su içerek hidratasyonumu sağlıyorum.',
    frequency: 'daily',
    streak: 8,
    completedDates: generateCompletedDates(8, 'daily'),
    category: 'health',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    color: '#3B82F6'
  },
  {
    id: '3',
    name: 'Egzersiz',
    description: 'Haftada 3 kez en az 30 dakika egzersiz yapıyorum.',
    frequency: 'weekly',
    streak: 4,
    completedDates: generateCompletedDates(4, 'weekly'),
    category: 'fitness',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    color: '#EF4444'
  },
  {
    id: '4',
    name: 'Günlük Okuma',
    description: 'Her gün en az 30 dakika kitap okuyorum.',
    frequency: 'daily',
    streak: 5,
    completedDates: generateCompletedDates(5, 'daily'),
    category: 'learning',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    color: '#8B5CF6'
  }
];

// Örnek günlük girişleri
export const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Harika bir gün!',
    content: 'Bugün hedeflerime doğru büyük adımlar attım. Meditasyon seansım çok iyiydi ve yeni öğrendiğim İngilizce kelimelerle cümleler kurma pratiği yaptım. Akşam da sevdiğim kitabı okumaya devam ettim. Kendimi çok motive hissediyorum!',
    mood: 5,
    tags: ['motivasyon', 'hedefler', 'öğrenme'],
    createdAt: new Date().toISOString(),
    weather: 'güneşli',
    gratitude: ['Sağlıklı olmak', 'Öğrenme fırsatları', 'Destekçi arkadaşlarım']
  },
  {
    id: '2',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    title: 'Zorluklar var ama pes etmiyorum',
    content: 'Bugün biraz zorlandım. İş yoğunluğu nedeniyle egzersiz yapamadım ve meditasyon sürem kısaldı. Ama yine de vazgeçmedim, küçük adımlarla da olsa ilerledim.',
    mood: 3,
    tags: ['zorluk', 'kararlılık', 'küçük adımlar'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    weather: 'bulutlu',
    gratitude: ['Ailem', 'İş imkanım', 'Kararlılığım']
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    title: 'Yeni hedefler belirleme zamanı',
    content: 'Bugün kişisel gelişim planımı gözden geçirdim. Bazı hedeflerimi güncellemem gerekiyor. Özellikle sosyal ilişkilerim konusunda daha fazla çaba göstermeli ve yeni hobiler edinmeliyim.',
    mood: 4,
    tags: ['planlama', 'hedefler', 'sosyal'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    weather: 'yağmurlu',
    gratitude: ['Planlama yeteneğim', 'Fırsat var', 'İyi sağlık']
  }
];

// Örnek kaynaklar
export const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    description: 'James Clear\'ın alışkanlık oluşturma konusundaki muhteşem rehberi.',
    type: 'book',
    category: 'productivity',
    author: 'James Clear',
    rating: 5,
    isCompleted: true,
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Çok etkili teknikler öğrendim. %1 kural özellikle faydalı oldu.'
  },
  {
    id: '2',
    title: 'How to Meditate',
    description: 'Meditasyon pratiği için başlangıç rehberi.',
    type: 'video',
    category: 'mindfulness',
    url: 'https://example.com/meditation-guide',
    rating: 4,
    isCompleted: true,
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Nefes teknikleri çok yardımcı oldu.'
  },
  {
    id: '3',
    title: 'The Power of Now',
    description: 'Eckhart Tolle\'nin şu an odaklı yaşam hakkındaki kitabı.',
    type: 'book',
    category: 'mindfulness',
    author: 'Eckhart Tolle',
    rating: 5,
    isCompleted: false,
    notes: 'Henüz okumaya başladım ama çok etkileyici.'
  },
  {
    id: '4',
    title: 'Productivity Masterclass',
    description: 'Verimlilik artırma teknikleri üzerine kapsamlı kurs.',
    type: 'course',
    category: 'productivity',
    url: 'https://example.com/productivity-course',
    rating: 4,
    isCompleted: false
  },
  {
    id: '5',
    title: 'The Tim Ferriss Show',
    description: 'Başarılı insanların hikayelerini dinle.',
    type: 'podcast',
    category: 'motivation',
    url: 'https://example.com/tim-ferriss-show',
    rating: 5,
    isCompleted: false,
    notes: 'Her bölüm çok ilham verici.'
  }
];

// Motivasyonel alıntılar
export const motivationalQuotes: QuoteData[] = [
  {
    id: 1,
    text: "Bir insanın hayatında yaşayacağı en önemli gün, hedeflerini belirlediği gündür.",
    author: "Anonim",
    category: "hedefler"
  },
  {
    id: 2,
    text: "Başarı, küçük çabaların günlük olarak tekrarlanmasıdır.",
    author: "Robert Collier",
    category: "alışkanlıklar"
  },
  {
    id: 3,
    text: "Dün tarih, yarın gizem, bugün ise hediye. Bu yüzden bugüne 'şimdi' denir.",
    author: "Bill Keane",
    category: "motivasyon"
  },
  {
    id: 4,
    text: "En güçlü insan, kendini kontrol eden insandır.",
    author: "Seneca",
    category: "öz-disiplin"
  },
  {
    id: 5,
    text: "Hayat %10 başınıza gelenler, %90 ise bunlara nasıl tepki verdiğinizdir.",
    author: "Charles R. Swindoll",
    category: "zihniyet"
  },
  {
    id: 6,
    text: "İnsanın en büyük zaferi kendine galip gelmesidir.",
    author: "Platon",
    category: "kişisel gelişim"
  }
];

// Yardımcı fonksiyonlar
function generateCompletedDates(streak: number, frequency: 'daily' | 'weekly'): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < streak; i++) {
    const date = new Date(today);
    if (frequency === 'daily') {
      date.setDate(today.getDate() - i);
    } else {
      date.setDate(today.getDate() - (i * 7));
    }
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates.reverse();
}

// Rastgele alıntı getirme
export const getRandomQuote = (): QuoteData => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

// Kategori renkleri
export const categoryColors = {
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
  social: '#F59E0B',
  motivation: '#EC4899'
};