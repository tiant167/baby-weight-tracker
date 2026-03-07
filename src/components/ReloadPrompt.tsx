import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      left: '1.5rem',
      maxWidth: '400px',
      margin: '0 auto',
      zIndex: 9999
    }}>
      <div className="glass-card animate-slide-up" style={{ 
        padding: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={18} color="var(--primary-color)" /> Update Available
          </h3>
          <button 
            className="btn-icon" 
            onClick={close}
            aria-label="Close"
            style={{ padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
        
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          A new version of Baby Growth Tracker is ready. Click below to update.
        </p>
        
        <button 
          className="btn btn-primary" 
          onClick={() => updateServiceWorker(true)}
          style={{ width: '100%', padding: '0.6rem' }}
        >
          Update Now
        </button>
      </div>
    </div>
  );
};
