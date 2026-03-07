import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface GrowthEntryFormProps {
  onAddEntry: (date: string, weight?: number, height?: number, headCirc?: number) => void;
}

export const GrowthEntryForm: React.FC<GrowthEntryFormProps> = ({ onAddEntry }) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    // Convert to numbers if they are valid
    const w = weight ? parseFloat(weight) : undefined;
    const h = height ? parseFloat(height) : undefined;
    const hc = headCirc ? parseFloat(headCirc) : undefined;

    // At least one metric must be provided
    if (w === undefined && h === undefined && hc === undefined) {
      alert("Please enter at least one measurement (Weight, Height, or Head Circumference).");
      return;
    }

    onAddEntry(date, w, h, hc);
    
    // Reset form after submission
    setWeight('');
    setHeight('');
    setHeadCirc('');
  };

  return (
    <form className="glass-card animate-slide-up" onSubmit={handleSubmit} style={{ animationDelay: '0.1s' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PlusCircle size={20} color="var(--primary-color)" /> Add Measurement
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="input-label" htmlFor="weight" style={{ fontSize: '0.75rem' }}>Weight (kg)</label>
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
            />
          </div>
          <div>
            <label className="input-label" htmlFor="height" style={{ fontSize: '0.75rem' }}>Height (cm)</label>
            <input
              id="height"
              type="number"
              step="0.1"
              min="30"
              max="130"
              placeholder="e.g. 60.5"
              className="input-field"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label" htmlFor="head" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Head Circ. (cm)</label>
            <input
              id="head"
              type="number"
              step="0.1"
              min="25"
              max="60"
              placeholder="e.g. 40.2"
              className="input-field"
              value={headCirc}
              onChange={(e) => setHeadCirc(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        Save Record
      </button>
    </form>
  );
};
