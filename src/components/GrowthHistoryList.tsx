import React from 'react';
import { Trash2 } from 'lucide-react';
import type { GrowthEntry } from '../hooks/useGrowthData';

interface GrowthHistoryListProps {
  entries: GrowthEntry[];
  onDeleteEntry: (id: string) => void;
}

export const GrowthHistoryList: React.FC<GrowthHistoryListProps> = ({ entries, onDeleteEntry }) => {
  // Sort descending for display
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>History</h2>
      
      {sortedEntries.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
          No records yet. Add a measurement to see it here!
        </p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedEntries.map((entry) => (
            <li 
              key={entry.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid var(--input-border)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '4px' }}>{entry.date}</div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {entry.weightInKg !== undefined && (
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>⚖️ {entry.weightInKg} kg</div>
                  )}
                  {entry.heightInCm !== undefined && (
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>📏 {entry.heightInCm} cm</div>
                  )}
                  {entry.headCirInCm !== undefined && (
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>🧠 {entry.headCirInCm} cm</div>
                  )}
                </div>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => onDeleteEntry(entry.id)}
                aria-label="Delete entry"
                title="Delete entry"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
