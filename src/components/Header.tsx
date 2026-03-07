import React from 'react';
import { Baby } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Baby Growth Tracker' }) => {
  return (
    <header className="glass-card animate-slide-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
    </header>
  );
};
