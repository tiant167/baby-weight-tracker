import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { differenceInDays } from 'date-fns';
import type { WeightEntry, BabyProfile } from '../hooks/useWeightData';
import { WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS } from '../data/whoStandards';

interface GrowthChartProps {
  entries: WeightEntry[];
  profile: BabyProfile | null;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ entries, profile }) => {
  const chartData = useMemo(() => {
    const whoData = profile?.gender === 'girl' ? WHO_WEIGHT_GIRLS : WHO_WEIGHT_BOYS;
    
    // Create base data up to 24 months
    const data = whoData.map(who => {
      return {
        month: who.month,
        monthLabel: `${who.month}m`,
        p3: who.p3,
        p15: who.p15,
        p50: who.p50,
        p85: who.p85,
        p97: who.p97,
        userWeight: null as number | null
      };
    });

    if (profile && profile.birthDate && entries.length > 0) {
      const birthDate = new Date(profile.birthDate);
      
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        
        // Calculate precise decimal month for more accurate plotting if we used a scatter chart, 
        // but for a categorical X-axis, we might slot it into the closest month
        const daysDiff = differenceInDays(entryDate, birthDate);
        const approxMonth = Math.round(daysDiff / 30.4375); // Average days in month

        if (approxMonth >= 0 && approxMonth <= 24) {
          // If there are multiple entries for the same month, we just take the latest one for simplicity in this visualization
          // Or we can average them. Here we just slot the entry's weight into that month's data point.
          data[approxMonth].userWeight = entry.weightInKg;
        }
      });
    }

    return data;
  }, [entries, profile]);

  if (!profile) {
    return (
      <div className="glass-card animate-slide-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', animationDelay: '0.2s' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Please save your baby's profile to view the growth chart.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card" style={{ padding: '10px', fontSize: '0.875rem', minWidth: '150px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label === '0m' ? 'Birth' : label}</p>
          {data.userWeight && (
            <p style={{ color: 'var(--chart-user-line)', fontWeight: 'bold' }}>
              Weight: {data.userWeight} kg
            </p>
          )}
          <div style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <p>WHO Percentiles:</p>
            <p>97th: {data.p97} kg</p>
            <p>50th: {data.p50} kg</p>
            <p>3rd: {data.p3} kg</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s', paddingBottom: '2.5rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Growth Curve (0-24m)</h2>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <div className="flex-center gap-sm">
            <div style={{ width: '12px', height: '12px', background: 'var(--chart-who-bg)', border: '1px solid var(--chart-who-line)', borderRadius: '2px' }}></div>
            WHO Range (3rd - 97th)
          </div>
          <div className="flex-center gap-sm">
            <div style={{ width: '12px', height: '12px', background: 'var(--chart-user-line)', borderRadius: '50%' }}></div>
            Your Baby
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorWho" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-who-line)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--chart-who-line)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--input-border)" />
            <XAxis 
              dataKey="monthLabel" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={{ stroke: 'var(--input-border)' }}
              tickLine={false}
              minTickGap={15}
            />
            <YAxis 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Background WHO ranges */}
            <Area type="monotone" dataKey="p97" stroke="none" fill="url(#colorWho)" />
            <Area type="monotone" dataKey="p3" stroke="none" fill="var(--bg-color)" /> {/* Cut out lower bound */}
            
            {/* WHO Median Line */}
            <Area type="monotone" dataKey="p50" stroke="var(--chart-who-line)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            
            {/* User Data Line */}
            {entries.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="userWeight" 
                stroke="var(--chart-user-line)" 
                strokeWidth={3}
                fill="none" 
                connectNulls={true}
                activeDot={{ r: 6, fill: 'var(--chart-user-dot)', stroke: '#fff', strokeWidth: 2 }}
                dot={{ r: 4, fill: 'var(--chart-user-dot)', strokeWidth: 0 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
