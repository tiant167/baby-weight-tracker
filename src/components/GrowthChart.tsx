import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { differenceInDays } from 'date-fns';
import type { GrowthEntry, BabyProfile } from '../hooks/useGrowthData';
import { 
  WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS,
  WHO_HEIGHT_BOYS, WHO_HEIGHT_GIRLS,
  WHO_HEAD_BOYS, WHO_HEAD_GIRLS
} from '../data/whoStandards';

interface GrowthChartProps {
  entries: GrowthEntry[];
  profile: BabyProfile | null;
}

type MetricType = 'weight' | 'height' | 'head';

export const GrowthChart: React.FC<GrowthChartProps> = ({ entries, profile }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('weight');

  const chartData = useMemo(() => {
    let whoData;
    const isGirl = profile?.gender === 'girl';

    if (activeMetric === 'weight') {
      whoData = isGirl ? WHO_WEIGHT_GIRLS : WHO_WEIGHT_BOYS;
    } else if (activeMetric === 'height') {
      whoData = isGirl ? WHO_HEIGHT_GIRLS : WHO_HEIGHT_BOYS;
    } else {
      whoData = isGirl ? WHO_HEAD_GIRLS : WHO_HEAD_BOYS;
    }
    
    // Create base data up to 24 months
    const data = whoData.map(who => {
      return {
        month: who.month,
        monthLabel: `${who.month}m`,
        p3: who.p3,
        p50: who.p50,
        p97: who.p97,
        userValue: null as number | null
      };
    });

    if (profile && profile.birthDate && entries.length > 0) {
      const birthDate = new Date(profile.birthDate);
      
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        const daysDiff = differenceInDays(entryDate, birthDate);
        const approxMonth = Math.round(daysDiff / 30.4375);

        if (approxMonth >= 0 && approxMonth <= 24) {
          if (activeMetric === 'weight' && entry.weightInKg !== undefined) {
            data[approxMonth].userValue = entry.weightInKg;
          } else if (activeMetric === 'height' && entry.heightInCm !== undefined) {
            data[approxMonth].userValue = entry.heightInCm;
          } else if (activeMetric === 'head' && entry.headCirInCm !== undefined) {
            data[approxMonth].userValue = entry.headCirInCm;
          }
        }
      });
    }

    return data;
  }, [entries, profile, activeMetric]);

  if (!profile) {
    return (
      <div className="glass-card animate-slide-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', animationDelay: '0.2s' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Please save your baby's profile to view the growth chart.</p>
      </div>
    );
  }

  const getMetricConfig = () => {
    if (activeMetric === 'weight') return { unit: 'kg', label: 'Weight' };
    if (activeMetric === 'height') return { unit: 'cm', label: 'Height' };
    return { unit: 'cm', label: 'Head Circ.' };
  };

  const config = getMetricConfig();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card" style={{ padding: '10px', fontSize: '0.875rem', minWidth: '150px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label === '0m' ? 'Birth' : label}</p>
          {data.userValue && (
            <p style={{ color: 'var(--chart-user-line)', fontWeight: 'bold' }}>
              Your Baby: {data.userValue} {config.unit}
            </p>
          )}
          <div style={{ marginTop: '5px', paddingTop: '5px', borderTop: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <p>WHO Percentiles:</p>
            <p>97th: {data.p97} {config.unit}</p>
            <p>50th: {data.p50} {config.unit}</p>
            <p>3rd: {data.p3} {config.unit}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s', paddingBottom: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Growth Curve (0-24m)</h2>
        
        {/* Metric Selector Tabs */}
        <div style={{ display: 'flex', background: 'var(--input-bg)', borderRadius: 'var(--radius-full)', padding: '4px', border: '1px solid var(--input-border)' }}>
          {(['weight', 'height', 'head'] as MetricType[]).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              style={{
                padding: '6px 12px',
                border: 'none',
                background: activeMetric === metric ? 'var(--primary-color)' : 'transparent',
                color: activeMetric === metric ? '#fff' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: activeMetric === metric ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {metric === 'weight' ? 'Weight' : metric === 'height' ? 'Height' : 'Head'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', justifyContent: 'center' }}>
        <div className="flex-center gap-sm">
          <div style={{ width: '12px', height: '12px', background: 'var(--chart-who-bg)', border: '1px solid var(--chart-who-line)', borderRadius: '2px' }}></div>
          WHO Range (3rd - 97th)
        </div>
        <div className="flex-center gap-sm">
          <div style={{ width: '12px', height: '12px', background: 'var(--chart-user-line)', borderRadius: '50%' }}></div>
          Your Baby
        </div>
      </div>

      <div style={{ width: '100%', minHeight: 400, flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWho" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-who-line)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--chart-who-line)" stopOpacity={0.15}/>
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
              domain={['dataMin - 2', 'auto']}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area type="monotone" dataKey="p97" stroke="none" fill="url(#colorWho)" isAnimationActive={false} />
            <Area type="monotone" dataKey="p3" stroke="none" fill="var(--bg-color)" isAnimationActive={false} />
            <Area type="monotone" dataKey="p50" stroke="var(--chart-who-line)" strokeWidth={2} strokeDasharray="5 5" fill="none" isAnimationActive={false} />
            
            {entries.length > 0 && (
              <Area 
                type="monotone" 
                dataKey="userValue" 
                stroke="var(--chart-user-line)" 
                strokeWidth={3}
                fill="none" 
                connectNulls={true}
                activeDot={{ r: 6, fill: 'var(--chart-user-dot)', stroke: '#fff', strokeWidth: 2 }}
                dot={{ r: 4, fill: 'var(--chart-user-dot)', strokeWidth: 0 }}
                isAnimationActive={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
