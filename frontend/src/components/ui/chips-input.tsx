import React, { useState } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { X } from 'lucide-react';

interface ChipsInputProps {
  value: string[];
  onChange: (chips: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function ChipsInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add...',
  disabled = false,
  id,
}: ChipsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newChip = inputValue.trim();
      
      // Avoid duplicates
      if (!value.includes(newChip)) {
        onChange([...value, newChip]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last chip when backspace is pressed with empty input
      onChange(value.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((chip, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1.5 flex items-center gap-1.5 whitespace-normal break-words max-w-[20rem] sm:max-w-[28rem]"
            >
              {chip}
              <button
                onClick={() => removeChip(index)}
                disabled={disabled}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors disabled:opacity-50"
                aria-label={`Remove ${chip}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
