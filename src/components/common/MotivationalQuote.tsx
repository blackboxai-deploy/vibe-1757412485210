"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRandomQuote, motivationalQuotes } from '@/lib/mockData';
import { QuoteData } from '@/lib/types';

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Component mount olduğunda ilk alıntıyı yükle
  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  const handleNewQuote = () => {
    setIsAnimating(true);
    
    // Animasyon sonrası yeni alıntı
    setTimeout(() => {
      let newQuote = getRandomQuote();
      // Aynı alıntının tekrar gelmemesini sağla
      while (currentQuote && newQuote.id === currentQuote.id && motivationalQuotes.length > 1) {
        newQuote = getRandomQuote();
      }
      setCurrentQuote(newQuote);
      setIsAnimating(false);
    }, 300);
  };

  if (!currentQuote) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`flex-1 space-y-4 transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            {/* Alıntı İkonu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                💡
              </div>
              <span className="text-sm font-medium text-muted-foreground">Bugünün İlhamı</span>
            </div>

            {/* Ana Alıntı */}
            <blockquote className="text-lg font-medium text-foreground leading-relaxed">
              "{currentQuote.text}"
            </blockquote>

            {/* Yazar ve Kategori */}
            <div className="flex items-center justify-between">
              <cite className="text-sm text-muted-foreground not-italic">
                — {currentQuote.author}
              </cite>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  #{currentQuote.category}
                </span>
              </div>
            </div>
          </div>

          {/* Yenile Butonu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewQuote}
            disabled={isAnimating}
            className="ml-4 h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-black/20"
            title="Yeni alıntı"
          >
            <span className={`text-lg transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
              🔄
            </span>
          </Button>
        </div>

        {/* Dekoratif Öğeler */}
        <div className="absolute top-2 right-2 opacity-20">
          <span className="text-2xl">✨</span>
        </div>
        <div className="absolute bottom-2 left-2 opacity-20">
          <span className="text-xl">🌟</span>
        </div>
      </CardContent>
    </Card>
  );
}