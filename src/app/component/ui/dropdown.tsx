'use client';

import { useState, useRef, useEffect } from 'react';
import { ThreeDots } from 'react-bootstrap-icons';
import { ReactNode } from 'react';

import Button from './button';

type Option = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type DropdownProps = {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
};

export default function Dropdown({ options, onSelect, placeholder = 'Select...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option.value);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        variant="tertiary"
        beforeIcon={<ThreeDots />}
        isLink={false}
      />

      {isOpen && (
        <ul className="absolute z-10 right-0 top-11 bg-dark-900 rounded-lg w-[130px] shadow">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={(e) => {
                e.stopPropagation(); // prevent dropdown from closing early
                handleSelect(option);
              }}
              className="px-4 py-2 flex flex-row gap-2 items-center hover:bg-gray-600 cursor-pointer"
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
