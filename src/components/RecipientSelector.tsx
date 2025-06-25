
import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, ChevronDown } from "lucide-react";
import { recipients, Recipient } from '../data/recipients';

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
}

const RecipientSelector = ({ selectedRecipients, onRecipientsChange }: RecipientSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRecipients = recipients.filter(recipient => {
    if (selectedRecipients.find(selected => selected.id === recipient.id)) {
      return false;
    }
    
    const searchTerm = search.toLowerCase();
    return (
      recipient.name.toLowerCase().includes(searchTerm) ||
      recipient.email.toLowerCase().includes(searchTerm) ||
      recipient.position.toLowerCase().includes(searchTerm) ||
      recipient.role.toLowerCase().includes(searchTerm) ||
      (recipient.department && recipient.department.toLowerCase().includes(searchTerm))
    );
  });

  const handleSelect = (recipient: Recipient) => {
    onRecipientsChange([...selectedRecipients, recipient]);
    setSearch('');
    setIsOpen(false);
  };

  const handleRemove = (recipientId: string) => {
    onRecipientsChange(selectedRecipients.filter(r => r.id !== recipientId));
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">받는 사람</Label>
      <div ref={containerRef} className="relative">
        <div 
          className="min-h-[40px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm cursor-pointer flex flex-wrap gap-1 items-center"
          onClick={() => setIsOpen(true)}
        >
          {selectedRecipients.map((recipient) => (
            <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1">
              <span>{recipient.name}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(recipient.id);
                }}
              />
            </Badge>
          ))}
          <span className="text-gray-500 flex-1 min-w-[120px]">
            {selectedRecipients.length === 0 ? '받는 사람을 선택하세요' : ''}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <Command className="rounded-md border-0">
              <CommandInput 
                placeholder="이름, 이메일, 직급으로 검색..."
                value={search}
                onValueChange={(value) => {
                  console.log('Search value changed:', value);
                  setSearch(value);
                }}
                className="border-0"
              />
              <CommandList className="max-h-48">
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {filteredRecipients.map((recipient) => (
                    <CommandItem
                      key={recipient.id}
                      onSelect={() => handleSelect(recipient)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <div className="font-medium">{recipient.name}</div>
                        <div className="text-sm text-gray-500">
                          {recipient.position} · {recipient.role}
                          {recipient.department && ` · ${recipient.department}`} · {recipient.email}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
