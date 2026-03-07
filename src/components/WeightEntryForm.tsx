import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface WeightEntryFormProps {
  onAddEntry: (date: string, weight: number) => void;
}

export const WeightEntryForm: React.FC<WeightEntryFormProps> = ({ onAddEntry }) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight) return;
    
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum) && weightNum > 0 && weightNum < 40) {
      onAddEntry(date, weightNum);
      setWeight('');
    }
  };

  return (
    <form className="glass-card animate-slide-up" onSubmit={handleSubmit} style={{ animationDelay: '0.1s' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PlusCircle size={20} color="var(--primary-color)" /> Add New Measurement
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label className="input-label" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className="input-field"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="input-label" htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            step="0.01"
            min="1"
            max="40"
            placeholder="e.g. 5.3"
            className="input-field"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        Save Record
      </button>
    </form>
  );
};
