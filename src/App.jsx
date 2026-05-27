import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard', 'habits', 'log'
  
  const [pillars, setPillars] = useState([]);
  const [habits, setHabits] = useState([]);
  const [metricDefs, setMetricDefs] = useState([]);
  const [metricLogs, setMetricLogs] = useState([]);
  const [userStats, setUserStats] = useState({ coins: 0, streak: 0 });

  // For the Log page
  const [logFormData, setLogFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: userData } = await supabase.from('user_stats').select('*').single();
      if (userData) setUserStats(userData);

      const { data: pillarsData } = await supabase.from('pillars').select('*').order('id');
      if (pillarsData) setPillars(pillarsData);

      const { data: habitsData } = await supabase.from('habits').select('*').order('id');
      if (habitsData) setHabits(habitsData);

      const { data: defsData } = await supabase.from('metric_defs').select('*');
      if (defsData) {
        setMetricDefs(defsData);
        // Initialize form state
        const initialForm = {};
        defsData.forEach(def => initialForm[def.id] = '');
        setLogFormData(initialForm);
      }

      // Fetch logs for the last 7 days
      const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const { data: logsData } = await supabase
        .from('metric_logs')
        .select('*')
        .gte('log_date', sevenDaysAgo)
        .order('log_date', { ascending: true });
      
      if (logsData) setMetricLogs(logsData);
    } catch (err) {
      console.error(err);
    }
  };

  const completeHabit = async (habit) => {
    try {
      // Optimistic UI
      setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, is_completed_today: true } : h));
      
      // Update DB
      await supabase.from('habits').update({ is_completed_today: true }).eq('id', habit.id);
      
      // Update Pillar XP
      const pillar = pillars.find(p => p.id === habit.pillar_id);
      if (pillar) {
        const newXp = pillar.xp + habit.xp_reward;
        let newLevel = pillar.level;
        let finalXp = newXp;
        if (newXp >= 1000) {
          newLevel += 1;
          finalXp -= 1000;
        }
        await supabase.from('pillars').update({ xp: finalXp, level: newLevel }).eq('id', pillar.id);
        setPillars(prev => prev.map(p => p.id === pillar.id ? { ...p, xp: finalXp, level: newLevel } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitLogs = async (e) => {
    e.preventDefault();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const upserts = Object.entries(logFormData)
      .filter(([_, val]) => val !== '')
      .map(([metricId, val]) => ({
        metric_id: Number(metricId),
        value: Number(val),
        log_date: today
      }));

    if (upserts.length === 0) return;

    try {
      await supabase.from('metric_logs').upsert(upserts, { onConflict: 'metric_id, log_date' });
      alert('Metrics logged successfully!');
      fetchData(); // refresh chart data
    } catch (err) {
      console.error(err);
    }
  };

  // --- Chart Data Preparation ---
  // Radar chart for Pillar Levels
  const radarData = pillars.map(p => ({
    subject: p.name,
    A: p.level + (p.xp / 1000), // Fractional level for smooth chart
    fullMark: 10,
  }));

  // Line chart for Metrics over time (combining metrics by date)
  const lineChartDataMap = {};
  metricLogs.forEach(log => {
    if (!lineChartDataMap[log.log_date]) {
      lineChartDataMap[log.log_date] = { date: format(parseISO(log.log_date), 'MMM dd') };
    }
    const def = metricDefs.find(d => d.id === log.metric_id);
    if (def) {
      lineChartDataMap[log.log_date][def.name] = log.value;
    }
  });
  const lineChartData = Object.values(lineChartDataMap).sort((a,b) => new Date(a.date) - new Date(b.date));


  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-indigo-500/30">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">COMMAND<span className="text-indigo-400">CENTER</span></h1>
          <p className="text-xs text-neutral-400 font-mono tracking-widest uppercase">System Active</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Streak</span>
            <span className="text-sm font-mono font-bold text-orange-400">{userStats.streak} Days</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-24 pt-6 px-4 max-w-lg mx-auto">
        
        {/* --- DASHBOARD PAGE --- */}
        {activePage === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Pillar Balance Radar */}
            <section className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold tracking-widest uppercase text-neutral-300 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-indigo-400">radar</span>
                Life Balance
              </h2>
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#404040" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 600, letterSpacing: 1 }} />
                    <Radar name="Level" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {pillars.map(p => (
                  <div key={p.id} className="bg-neutral-800 p-3 rounded-xl border border-neutral-700 flex items-center gap-3">
                    <span className="material-symbols-outlined" style={{ color: p.color }}>{p.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">{p.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">LVL {p.level} • {p.xp}XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Metric Trends Line Chart */}
            <section className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold tracking-widest uppercase text-neutral-300 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400">trending_up</span>
                7-Day Trends
              </h2>
              <div className="h-56 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                    <XAxis dataKey="date" stroke="#737373" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#737373" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#262626', border: '1px solid #404040', borderRadius: '8px', fontSize: '12px' }} />
                    {metricDefs.map((def, idx) => {
                      const colors = ['#34d399', '#f472b6', '#fbbf24', '#60a5fa'];
                      return (
                        <Line 
                          key={def.id}
                          type="monotone" 
                          dataKey={def.name} 
                          stroke={colors[idx % colors.length]} 
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#262626', strokeWidth: 2 }}
                          activeDot={{ r: 5 }}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {/* --- HABITS PAGE --- */}
        {activePage === 'habits' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white tracking-tight">Daily Directives</h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Complete these routines to build your core pillars and level up your life attributes.</p>
            
            <div className="space-y-3">
              {habits.map(habit => {
                const pillar = pillars.find(p => p.id === habit.pillar_id);
                return (
                  <div key={habit.id} className={`p-4 rounded-2xl border transition-all ${habit.is_completed_today ? 'bg-neutral-800/30 border-neutral-800 opacity-50' : 'bg-neutral-800 border-neutral-700 shadow-lg'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-neutral-900 border" style={{ borderColor: pillar?.color, color: pillar?.color }}>
                        {pillar?.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-300">+{habit.xp_reward} XP</span>
                    </div>
                    <h3 className={`text-sm font-bold mb-1 ${habit.is_completed_today ? 'line-through text-neutral-500' : 'text-white'}`}>{habit.title}</h3>
                    <p className="text-xs text-neutral-400 mb-4">{habit.description}</p>
                    
                    {!habit.is_completed_today ? (
                      <button 
                        onClick={() => completeHabit(habit)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-neutral-800 text-neutral-500 text-center border border-neutral-700">
                        Completed
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* --- DAILY LOG PAGE --- */}
        {activePage === 'log' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white tracking-tight">Daily Reflection</h2>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">Input your qualitative and quantitative metrics to generate your analytics dashboard.</p>
            
            <form onSubmit={submitLogs} className="bg-neutral-800/50 border border-neutral-700/50 p-6 rounded-2xl shadow-xl space-y-6">
              {metricDefs.map(def => {
                const pillar = pillars.find(p => p.id === def.pillar_id);
                return (
                  <div key={def.id}>
                    <label className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: pillar?.color }}>{pillar?.icon}</span>
                        {def.name}
                      </span>
                      <span className="text-neutral-500 font-mono">({def.unit})</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      min={def.min_val}
                      max={def.max_val}
                      value={logFormData[def.id] || ''}
                      onChange={(e) => setLogFormData({...logFormData, [def.id]: e.target.value})}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-neutral-600 font-mono"
                      placeholder={`Enter value...`}
                    />
                  </div>
                )
              })}
              
              <button 
                type="submit"
                className="w-full py-3.5 mt-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Save Daily Logs
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-neutral-900 border-t border-neutral-800 px-6 py-4 pb-8 z-50 flex justify-between items-center">
        <button 
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'dashboard' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activePage==='dashboard' ? "'FILL' 1" : "" }}>query_stats</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Data</span>
        </button>
        <button 
          onClick={() => setActivePage('habits')}
          className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'habits' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activePage==='habits' ? "'FILL' 1" : "" }}>check_circle</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Habits</span>
        </button>
        <button 
          onClick={() => setActivePage('log')}
          className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'log' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activePage==='log' ? "'FILL' 1" : "" }}>edit_document</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Log</span>
        </button>
      </nav>

    </div>
  );
}
