import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal';
  size?: 'default' | 'sm' | 'lg';
}

export const ThemeToggle = ({ variant = 'default', size = 'default' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-9 h-9"
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
          {theme === 'light' ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium">Theme</p>
          <p className="text-sm text-muted-foreground">
            {theme === 'light' ? 'Light mode' : 'Dark mode'}
          </p>
        </div>
      </div>
      
      <Button
        variant="outline"
        size={size}
        onClick={toggleTheme}
        className="shrink-0"
      >
        {theme === 'light' ? (
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <span className="hidden sm:inline">Dark</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <span className="hidden sm:inline">Light</span>
          </div>
        )}
      </Button>
    </div>
  );
};

// Advanced theme toggle with system preference option
export const AdvancedThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
          {theme === 'light' ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium">Appearance</p>
          <p className="text-sm text-muted-foreground">
            Customize how KasiSave looks on your device
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => handleThemeChange('light')}
        >
          <Sun className="w-5 h-5" />
          <span className="text-sm">Light</span>
        </Button>

        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="w-5 h-5" />
          <span className="text-sm">Dark</span>
        </Button>
      </div>
    </div>
  );
};