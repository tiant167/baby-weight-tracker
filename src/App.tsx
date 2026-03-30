import React, { useState, useEffect } from 'react';
import { useGrowthData } from './hooks/useGrowthData';
import { Header } from './components/Header';
import { GrowthEntryForm } from './components/GrowthEntryForm';
import { GrowthHistoryList } from './components/GrowthHistoryList';
import { GrowthChart } from './components/GrowthChart';
import { ReloadPrompt } from './components/ReloadPrompt';
import { SiriSetupModal } from './components/SiriSetupModal';

function App() {
  const { entries, addEntry, updateEntry, deleteEntry, profile, updateProfile, exportData } = useGrowthData();
  
  // Profile Form state
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [profileDate, setProfileDate] = useState(profile?.birthDate || '');
  const [profileGender, setProfileGender] = useState<'boy' | 'girl'>(profile?.gender || 'boy');

  // Siri Modal State
  const [isSiriModalOpen, setIsSiriModalOpen] = useState(false);

  // Handle URL Schemes (e.g. from Siri Shortcuts)
  useEffect(() => {
    if (!profile) return; // Only process if profile is setup

    const searchParams = new URLSearchParams(window.location.search);
    const action = searchParams.get('action');

    if (action === 'add_record') {
      const weightStr = searchParams.get('weight');
      const heightStr = searchParams.get('height');
      const headStr = searchParams.get('head');

      const w = weightStr ? parseFloat(weightStr) : undefined;
      const h = heightStr ? parseFloat(heightStr) : undefined;
      const hc = headStr ? parseFloat(headStr) : undefined;

      // Only add if at least one valid number is provided
      if ((w && !isNaN(w)) || (h && !isNaN(h)) || (hc && !isNaN(hc))) {
        const today = new Date().toISOString().split('T')[0];
        
        // Timeout ensures the state has time to settle before adding the entry
        // Also helps avoid React strict mode double-firing complexities
        setTimeout(() => {
          addEntry(
            today, 
            (!w || isNaN(w)) ? undefined : w, 
            (!h || isNaN(h)) ? undefined : h, 
            (!hc || isNaN(hc)) ? undefined : hc
          );
        }, 100);
      }

      // Clean up the URL so reloads don't trigger it again
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }
  }, [profile, addEntry]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName && profileDate) {
      updateProfile({
        name: profileName,
        birthDate: profileDate,
        gender: profileGender
      });
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <Header 
        title={profile ? `${profile.name}'s Growth` : 'Baby Growth Tracker'} 
        onExport={profile ? exportData : undefined}
        onSiriSetup={profile ? () => setIsSiriModalOpen(true) : undefined}
      />

      {!profile ? (
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Welcome! Let's get started</h2>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="input-label" htmlFor="name">Baby's Name</label>
                <input
                  id="name"
                  type="text"
                  className="input-field"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Leo"
                  required
                />
              </div>
              <div>
                <label className="input-label" htmlFor="birthDate">Birth Date</label>
                <input
                  id="birthDate"
                  type="date"
                  className="input-field"
                  value={profileDate}
                  onChange={(e) => setProfileDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="input-label">Gender (for WHO Chart)</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="boy" 
                      checked={profileGender === 'boy'} 
                      onChange={() => setProfileGender('boy')}
                    /> Boy
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="girl" 
                      checked={profileGender === 'girl'} 
                      onChange={() => setProfileGender('girl')}
                    /> Girl
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Profile
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="dashboard-layout">
            <div className="dashboard-sidebar">
              <GrowthEntryForm onAddEntry={addEntry} />
              <GrowthHistoryList entries={entries} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry} />
            </div>
            <div className="dashboard-chart-column">
              <GrowthChart entries={entries} profile={profile} />
            </div>
          </div>
        </div>
      )}

      {/* Siri Setup Modal */}
      {isSiriModalOpen && <SiriSetupModal onClose={() => setIsSiriModalOpen(false)} />}

      {/* PWA Update Prompt */}
      <ReloadPrompt />
    </div>
  );
}

export default App;
