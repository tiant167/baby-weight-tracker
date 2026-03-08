import React from 'react';
import { Baby, Download, Mic } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onExport?: () => void;
  onSiriSetup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Baby Growth Tracker', onExport, onSiriSetup }) => {
  return (
    <header className="glass-card animate-slide-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="flex-center" style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, var(--primary-light), white)',
          boxShadow: '0 4px 10px rgba(59, 130, 246, 0.1)',
          flexShrink: 0
        }}>
          <Baby size={28} color="var(--primary-color)" />
        </div>
        <div>
          <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{title}</h1>
          <p className="subtitle" style={{ fontSize: '0.875rem', marginBottom: 0 }}>Track weight & compare with WHO standards</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {onSiriSetup && (
          <button 
            onClick={onSiriSetup}
            className="btn" 
            style={{ 
              background: 'var(--primary-light)', 
              color: 'var(--primary-hover)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem'
            }}
            title="Setup Siri Voice Shortcuts"
          >
            <Mic size={16} /> Siri Setup
          </button>
        )}

        {onExport && (
          <button 
            onClick={onExport}
            className="btn" 
            style={{ 
              background: 'var(--input-bg)', 
              border: '1px solid var(--input-border)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem'
            }}
            title="Backup Data to File / iCloud"
          >
            <Download size={16} /> Export Backup
          </button>
        )}
      </div>
    </header>
  );
};
