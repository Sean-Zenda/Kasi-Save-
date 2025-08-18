import { forwardRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  maxLength?: number;
  helperText?: string;
  error?: string;
  className?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    onKeyPress,
    disabled = false,
    maxLength,
    helperText,
    error,
    className = ''
  }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="block font-medium">
          {label}
        </Label>
        <Input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          maxLength={maxLength}
          className={`h-12 ${error ? 'border-destructive' : ''}`}
        />
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';