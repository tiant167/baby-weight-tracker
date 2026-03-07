import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { GrowthEntry } from '../hooks/useGrowthData';

interface GrowthHistoryListProps {
  entries: GrowthEntry[];
  onUpdateEntry: (id: string, updates: Partial<GrowthEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export const GrowthHistoryList: React.FC<GrowthHistoryListProps> = ({ entries, onUpdateEntry, onDeleteEntry }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{date: string, weightInKg: string, heightInCm: string, headCirInCm: string}>({
    date: '', weightInKg: '', heightInCm: '', headCirInCm: ''
  });

  // Sort descending for display
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startEditing = (entry: GrowthEntry) => {
    setEditingId(entry.id);
    setEditForm({
      date: entry.date,
      weightInKg: entry.weightInKg !== undefined ? String(entry.weightInKg) : '',
      heightInCm: entry.heightInCm !== undefined ? String(entry.heightInCm) : '',
      headCirInCm: entry.headCirInCm !== undefined ? String(entry.headCirInCm) : ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ date: '', weightInKg: '', heightInCm: '', headCirInCm: '' });
  };

  const saveEditing = (id: string) => {
    if (!editForm.date) return;
    
    // Ensure at least one value exists across parsed metrics
    const w = editForm.weightInKg !== undefined && editForm.weightInKg !== '' ? Number(editForm.weightInKg) : undefined;
    const h = editForm.heightInCm !== undefined && editForm.heightInCm !== '' ? Number(editForm.heightInCm) : undefined;
    const hc = editForm.headCirInCm !== undefined && editForm.headCirInCm !== '' ? Number(editForm.headCirInCm) : undefined;

    if (w === undefined && h === undefined && hc === undefined) {
      alert("Please enter at least one measurement.");
      return;
    }

    onUpdateEntry(id, {
      date: editForm.date,
      weightInKg: w,
      heightInCm: h,
      headCirInCm: hc
    });
    cancelEditing();
  };

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>History</h2>
      
      {sortedEntries.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
          No records yet. Add a measurement to see it here!
        </p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedEntries.map((entry) => {
            const isEditing = editingId === entry.id;

            return (
              <li 
                key={entry.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: isEditing ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: isEditing ? 'stretch' : 'center',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isEditing ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                  border: isEditing ? '1px solid var(--primary-color)' : '1px solid var(--input-border)',
                  transition: 'all var(--transition-fast)',
                  gap: isEditing ? '1rem' : '0'
                }}
                onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { if (!isEditing) e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                {isEditing ? (
                  // Edit Mode UI
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                      <input
                        type="date"
                        className="input-field"
                        value={editForm.date || ''}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        required
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Weight (kg)"
                          className="input-field"
                          value={editForm.weightInKg}
                          onChange={(e) => setEditForm(prev => ({ ...prev, weightInKg: e.target.value }))}
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Height (cm)"
                          className="input-field"
                          value={editForm.heightInCm}
                          onChange={(e) => setEditForm(prev => ({ ...prev, heightInCm: e.target.value }))}
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Head (cm)"
                          className="input-field"
                          value={editForm.headCirInCm}
                          onChange={(e) => setEditForm(prev => ({ ...prev, headCirInCm: e.target.value }))}
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        className="btn-icon" 
                        onClick={cancelEditing}
                        title="Cancel"
                        style={{ background: 'var(--input-bg)', color: 'var(--text-secondary)' }}
                      >
                        <X size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => saveEditing(entry.id)}
                        title="Save"
                        style={{ background: 'var(--primary-color)', color: '#fff' }}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  // View Mode UI
                  <>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => startEditing(entry)}
                        aria-label="Edit entry"
                        title="Edit entry"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => onDeleteEntry(entry.id)}
                        aria-label="Delete entry"
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
