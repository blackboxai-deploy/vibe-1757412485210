"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

// Navigasyon menü öğeleri
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Genel bakış ve istatistikler'
  },
  {
    name: 'Hedefler',
    href: '/goals',
    icon: '🎯',
    description: 'Hedef belirleme ve takip'
  },
  {
    name: 'Alışkanlıklar',
    href: '/habits',
    icon: '✅',
    description: 'Günlük alışkanlık takibi'
  },
  {
    name: 'Günlük',
    href: '/journal',
    icon: '📝',
    description: 'Düşünceler ve değerlendirmeler'
  },
  {
    name: 'Kaynaklar',
    href: '/resources',
    icon: '📚',
    description: 'Kişisel gelişim materyalleri'
  }
];

interface NavigationProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Navigation({ isCollapsed = false, onToggle }: NavigationProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              PD
            </div>
            <span className="font-semibold text-foreground">Kişisel Gelişim</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                isCollapsed && "justify-center"
              )}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-75 truncate">{item.description}</div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-2"
          )}
        >
          <span className="text-lg mr-2">{theme === 'dark' ? '☀️' : '🌙'}</span>
          {!isCollapsed && (
            <span className="text-sm">{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
          )}
        </Button>

        {/* User Info */}
        {!isCollapsed && (
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-accent/30">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Kullanıcı</div>
              <div className="text-xs text-muted-foreground truncate">Kişisel Gelişim Yolculuğu</div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}