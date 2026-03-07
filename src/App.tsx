import React, { useState } from 'react';
import { useGrowthData } from './hooks/useGrowthData';
import { Header } from './components/Header';
import { GrowthEntryForm } from './components/GrowthEntryForm';
import { GrowthHistoryList } from './components/GrowthHistoryList';
import { GrowthChart } from './components/GrowthChart';

function App() {
  const { entries, addEntry, updateEntry, deleteEntry, profile, updateProfile } = useGrowthData();
  
  // Profile Form state
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [profileDate, setProfileDate] = useState(profile?.birthDate || '');
  const [profileGender, setProfileGender] = useState<'boy' | 'girl'>(profile?.gender || 'boy');

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
      <Header title={profile ? `${profile.name}'s Growth` : 'Baby Growth Tracker'} />

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <GrowthEntryForm onAddEntry={addEntry} />
              <GrowthHistoryList entries={entries} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <GrowthChart entries={entries} profile={profile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
