import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { GrowthEntry } from '../hooks/useGrowthData';

interface GrowthHistoryListProps {
  entries: GrowthEntry[];
  onUpdateEntry: (id: string, updates: Partial<GrowthEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

const PAGE_SIZE = 4;

export const GrowthHistoryList: React.FC<GrowthHistoryListProps> = ({ entries, onUpdateEntry, onDeleteEntry }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const previousSortedIdsRef = useRef<string[]>([]);
  const pendingRevealEntryIdRef = useRef<string | null>(null);
  const [editForm, setEditForm] = useState<{date: string, weightInKg: string, heightInCm: string, headCirInCm: string}>({
    date: '', weightInKg: '', heightInCm: '', headCirInCm: ''
  });

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries]
  );
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / PAGE_SIZE));
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedEntries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, sortedEntries]);

  useEffect(() => {
    const currentSortedIds = sortedEntries.map((entry) => entry.id);
    const previousSortedIds = previousSortedIdsRef.current;
    const hasPreviousEntries = previousSortedIds.length > 0;
    const hasNewEntry = sortedEntries.length > previousSortedIds.length;
    const orderChanged =
      hasPreviousEntries &&
      previousSortedIds.length === currentSortedIds.length &&
      previousSortedIds.some((id, index) => id !== currentSortedIds[index]);

    if (pendingRevealEntryIdRef.current) {
      const targetIndex = sortedEntries.findIndex((entry) => entry.id === pendingRevealEntryIdRef.current);
      const targetPage = targetIndex >= 0 ? Math.floor(targetIndex / PAGE_SIZE) + 1 : 1;
      pendingRevealEntryIdRef.current = null;
      setCurrentPage(targetPage);
    } else if (hasNewEntry || orderChanged) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    previousSortedIdsRef.current = currentSortedIds;
  }, [currentPage, sortedEntries, totalPages]);

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

    pendingRevealEntryIdRef.current = id;

    onUpdateEntry(id, {
      date: editForm.date,
      weightInKg: w,
      heightInCm: h,
      headCirInCm: hc
    });
    cancelEditing();
  };

  return (
    <div
      className="glass-card animate-slide-up history-card"
      style={{
        animationDelay: '0.3s',
        minHeight: sortedEntries.length === 0 ? '220px' : '430px'
      }}
    >
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>History</h2>
      
      {sortedEntries.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
          No records yet. Add a measurement to see it here!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paginatedEntries.map((entry) => {
              const isEditing = editingId === entry.id;

              return (
                <li 
                  key={entry.id} 
                  className={isEditing ? 'history-entry editing' : 'history-entry'}
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
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                    <>
                      <div
                        className="history-entry-content"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'grid',
                          gridTemplateColumns: '108px minmax(0, 1fr)',
                          gap: '0.5rem 0.875rem',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{entry.date}</div>
                        <div className="history-entry-metrics" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {entry.weightInKg !== undefined && (
                            <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>⚖️ {entry.weightInKg} kg</div>
                          )}
                          {entry.heightInCm !== undefined && (
                            <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>📏 {entry.heightInCm} cm</div>
                          )}
                          {entry.headCirInCm !== undefined && (
                            <div style={{ fontWeight: 600, fontSize: '0.92rem', whiteSpace: 'nowrap' }}>🧠 {entry.headCirInCm} cm</div>
                          )}
                        </div>
                      </div>
                      <div className="history-entry-actions" style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
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
          {totalPages > 1 && (
            <div className="history-pagination">
              <button
                type="button"
                className="history-pagination-button"
                onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="history-pagination-status">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="history-pagination-button"
                onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
