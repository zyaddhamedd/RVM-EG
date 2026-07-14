'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  id?: string;
  name: string;
  options: { label: string; value: string }[];
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export function CustomSelect({ 
  id,
  name, 
  options, 
  placeholder, 
  required,
  value,
  onChange,
  onBlur,
  error,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : internalSelected;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen && onBlur) {
          onBlur();
        }
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const handleSelect = (val: string) => {
    if (value === undefined) setInternalSelected(val);
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === selected)?.label;

  return (
    <div className="relative" ref={containerRef}>
      {/* Hidden native select for form submission */}
      <select 
        name={name} 
        value={selected} 
        required={required} 
        className="hidden" 
        onChange={(e) => {
          if (value === undefined) setInternalSelected(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom UI */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => {
          // If we close via click outside, it's handled above. But if we tab away:
          // Wait a tick to see if focus moved inside the container
          setTimeout(() => {
            if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
              if (isOpen) setIsOpen(false);
              if (onBlur) onBlur();
            }
          }, 0);
        }}
        className={`w-full flex items-center justify-between bg-neutral-950 border rounded-lg px-4 py-3 text-left transition-colors min-h-[44px] ${
          error ? 'border-red-500 focus:ring-red-500' :
          isOpen ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]' : 'border-neutral-800'
        } ${selected ? 'text-white' : 'text-neutral-500'} focus:outline-none focus:ring-1`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden"
            role="listbox"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected === opt.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt.value);
                }}
                className={`px-4 py-3 cursor-pointer transition-colors min-h-[44px] flex items-center ${
                  selected === opt.value ? 'bg-neutral-800 text-[#CCFF00]' : 'text-white hover:bg-neutral-800'
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
