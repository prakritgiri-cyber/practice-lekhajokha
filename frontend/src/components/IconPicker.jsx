import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

// Popular icons for expense categories
const popularIcons = [
  'Utensils', 'ShoppingCart', 'BookOpen', 'Bus', 'GraduationCap', 'Wifi', 'Heart',
  'Shirt', 'Coffee', 'Smartphone', 'Home', 'Zap', 'Music', 'Film', 'Gamepad',
  'Dumbbell', 'Plane', 'Gift', 'Briefcase', 'Wrench', 'PaintBucket', 'Scissors',
  'Phone', 'Mail', 'Calendar', 'Clock', 'DollarSign', 'CreditCard', 'Wallet',
  'Laptop', 'Tv', 'Camera', 'Headphones', 'Lightbulb', 'Umbrella', 'TreePine'
];

const IconPicker = ({ open, onClose, onSelectIcon }) => {
  const [search, setSearch] = useState('');

  const filteredIcons = popularIcons.filter(iconName =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const handleIconSelect = (iconName) => {
    onSelectIcon(iconName);
    onClose();
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-96">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {filteredIcons.map(iconName => {
                const IconComponent = Icons[iconName];
                return (
                  <Button
                    key={iconName}
                    variant="outline"
                    className="h-16 w-16 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-500 transition-all"
                    onClick={() => handleIconSelect(iconName)}
                    title={iconName}
                  >
                    <IconComponent className="w-6 h-6" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          {filteredIcons.length === 0 && (
            <p className="text-center text-gray-500 py-8">No icons found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;