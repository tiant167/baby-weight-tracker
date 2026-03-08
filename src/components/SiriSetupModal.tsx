import React from 'react';
import { Mic, X, Copy, CheckCircle2 } from 'lucide-react';

interface SiriSetupModalProps {
  onClose: () => void;
}

export const SiriSetupModal: React.FC<SiriSetupModalProps> = ({ onClose }) => {
  const [copied, setCopied] = React.useState(false);

  // Dynamically get the exact origin (e.g., https://my-baby-app.vercel.app)
  // so no environment variables or hardcoding is needed.
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const actionUrl = `${baseUrl}/?action=add_record&weight=`;

  const handleCopy = () => {
    navigator.clipboard.writeText(actionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-card animate-slide-up" style={{ 
        width: '100%', 
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: 'var(--bg-color)', 
        border: '1px solid var(--input-border)'
      }}>
        <button 
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="flex-center" style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '50%', color: '#fff' }}>
            <Mic size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Siri Shortcuts Integration</h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Apple strictly restricts auto-installing Shortcuts from websites for security. You will need to create the Shortcut once on your iPhone, but we've made it as simple as copy-and-paste. Your domain is automatically detected below!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Step 1: Copy your personal URL</h3>
            <div style={{ 
              display: 'flex', 
              background: 'var(--input-bg)', 
              border: `1px solid var(--input-border)`, 
              padding: '0.5rem', 
              borderRadius: 'var(--radius-sm)',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input 
                type="text" 
                readOnly 
                value={actionUrl}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.75rem' }}
              />
              <button 
                onClick={handleCopy}
                className="btn"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: copied ? 'var(--chart-who-bg)' : 'var(--primary-light)', color: copied ? 'var(--primary-color)' : 'var(--primary-hover)' }}
              >
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Step 2: Create the Shortcut</h3>
            <ol style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Open the <strong>Shortcuts</strong> app on your iPhone and tap <strong>+</strong>.</li>
              <li>Name it your voice command (e.g. "Record Baby Weight").</li>
              <li>Add Action: <strong>"Ask for Input"</strong>. Set type to Number, prompt to "Weight in kg?".</li>
              <li>Add Action: <strong>"URL"</strong>. Paste the URL you copied above, and place the cursor at the very end. Insert the <strong>Provided Input</strong> magic variable to the end of the URL.</li>
              <li>Add Action: <strong>"Open URLs"</strong> and select the URL variable.</li>
            </ol>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '2rem' }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
