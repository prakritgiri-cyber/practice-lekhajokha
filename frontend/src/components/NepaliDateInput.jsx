import React from 'react';
import NepaliDate from 'nepali-date-converter';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';

const NepaliDateInput = ({ value, onChange, label }) => {
  // Convert Nepali date string to display format
  const formatNepaliDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const currentNepaliDate = new NepaliDate().format('YYYY-MM-DD');

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          type="date"
          value={value || currentNepaliDate}
          onChange={handleChange}
          className="pl-10"
          max={currentNepaliDate}
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
      <p className="text-xs text-gray-500">
        Nepali Date: {value ? formatNepaliDate(value) : 'Select date'}
      </p>
    </div>
  );
};

export default NepaliDateInput;