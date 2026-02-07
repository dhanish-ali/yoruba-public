import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Award, Building2, Crown, Loader2, BookOpen, ChevronLeft, Languages, Star, Search, X } from 'lucide-react';

/** * 1. DHANISH: PASTE YOUR FIREBASE CONFIG KEYS HERE 
 */
const firebaseConfig = {
  apiKey: "AIzaSyDupi8v6N1Y-4iTvOZ67VE9yH_ytTUCU7Y",
  authDomain: "yoruba-2026.firebaseapp.com",
  projectId: "yoruba-2026",
  storageBucket: "yoruba-2026.appspot.com",
  messagingSenderId: "1034857419855",
  appId: "1:1034857419855:web:7c7c0f0c3b8f2e3a4b5c6d"
};

/** * 2. DHANISH: CHANGE YOUR LOGO LINKS HERE
 */
const mainLogoUrl = "https://ibb.co/pr5hFSrX"; 
const collegeLogoUrl = "https://ibb.co/dspKSWXx";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'competition-2026-dhanish'; 

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'result', 'scoreboard'
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error("Auth Error", err));
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'submissions'), (snap) => {
      setParticipants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // --- LOGIC: DEPARTMENT RANKING ONLY ---
  const deptLeaderboard = useMemo(() => {
    const scores = {};
    participants.forEach(p => {
      const d = p.department || 'General';
      scores[d] = (scores[d] || 0) + (Number(p.points) || 0);
    });
    return Object.entries(scores)
      .map(([name, total]) => ({ name, total }))
      .sort((a,b) => b.total - a.total);
  }, [participants]);

  // Filtered Winners List for the Result Tab
  const filteredWinners = useMemo(() => {
    const winners = participants.filter(p => p.rank).sort((a,b) => a.rank - b.rank);
    if (!searchTerm.trim()) return winners;
    
    const term = searchTerm.toLowerCase();
    return winners.filter(p => 
      p.name?.toLowerCase().includes(term) || 
      p.program?.toLowerCase().includes(term)
    );
  }, [participants, searchTerm]);

  if (loading) return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center font-sans">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900 opacity-40">Syncing Yoruba Live</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e0f2fe] text-slate-900 font-sans selection:bg-blue-600 overflow-x-hidden relative">
      
      {/* PROFESSIONAL TEXTURED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-200 via-white to-blue-100 opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-300/30 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky-400/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto min-h-screen flex flex-col py-12 px-6">
        
        {/* --- SCREEN: HOME (The Landing Interface) --- */}
        {view === 'home' && (
          <div className="flex-1 flex flex-col items-center text-center animate-in fade-in duration-1000">
            <h2 className="text-xl md:text-2xl font-black tracking-tight mb-8 text-blue-950 uppercase leading-tight">
              VANGUARDIA STUDENTS <br /> UNION 2025-26
            </h2>

          {/* FLOATING LOGO - Circle Removed */}
<div className="w-60 h-60 md:w-80 md:h-80 flex items-center justify-center mb-10 relative animate-bounce-slow">
  <img 
    src={mainLogoUrl} 
    alt="Logo" 
    className="w-full h-full object-contain" 
    onError={(e)=>e.target.style.opacity='0.1'} 
  />
</div>

            <h1 className="text-3xl md:text-4xl font-black mb-1 uppercase tracking-tighter text-blue-950 leading-tight">
              YORUBA FINE ARTS <br /> 2025-26
            </h1>

            <p className="text-blue-600 font-black tracking-[0.4em] text-lg mb-14 uppercase">
              PROGRAMS 5, 6, 9, 10
            </p>

            {/* COLLEGE INFO */}
            <div className="w-full flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-[2rem] mb-14 text-left border border-white shadow-lg">
              <div className="w-16 h-16 bg-white rounded-full flex-shrink-0 flex items-center justify-center p-1 border-2 border-blue-100">
                <img src={collegeLogoUrl} alt="College" className="w-full h-full object-contain" />
              </div>
              <p className="font-black text-sm md:text-base leading-tight uppercase text-blue-950 italic">
                GOVT. ARTS AND SCIENCE COLLEGE CALICUT
              </p>
            </div>

            {/* DASHBOARD BUTTONS */}
            <div className="grid grid-cols-2 gap-5 w-full">
              <button onClick={() => setView('scoreboard')} className="bg-[#1e293b] hover:bg-blue-900 text-white font-black py-7 rounded-2xl text-xl uppercase transition-all shadow-xl active:scale-95 border-b-8 border-black/40">Score Board</button>
              <button onClick={() => { setView('result'); setSearchTerm(''); }} className="bg-[#1e293b] hover:bg-blue-900 text-white font-black py-7 rounded-2xl text-xl uppercase transition-all shadow-xl active:scale-95 border-b-8 border-black/40">Result</button>
            </div>
          </div>
        )}

        {/* --- SCREEN: RESULT (Winners List with Search) --- */}
        {view === 'result' && (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-blue-700 font-black uppercase text-xs tracking-widest bg-white/50 px-4 py-2 rounded-full"><ChevronLeft size={18}/> Back Home</button>
              <h3 className="text-xl font-black italic uppercase text-blue-950 tracking-tighter">Official Winners</h3>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text"
                placeholder="Search Name or Programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/60 backdrop-blur-md border-2 border-white focus:border-blue-400 focus:bg-white p-4 pl-12 pr-12 rounded-[1.5rem] shadow-lg outline-none transition-all font-bold text-blue-900 placeholder:text-blue-300 placeholder:font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-4 flex items-center text-blue-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {filteredWinners.map((p) => (
                <div key={p.id} className="bg-white/70 backdrop-blur-xl border-2 border-white p-8 rounded-[3rem] relative overflow-hidden shadow-xl group animate-in slide-in-from-bottom-4 duration-300">
                  <div className="absolute top-0 right-0 p-6 text-7xl font-black text-blue-900/5 italic pointer-events-none">#{p.rank}</div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                    <BookOpen size={14}/> {p.program} <span className="opacity-20">|</span> <Languages size={14}/> {p.language || 'Any'}
                  </div>
                  <div className="text-3xl font-black uppercase text-slate-800 leading-none mb-3 pr-12">{p.name}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{p.department}</div>
                  <div className={`mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${p.rank === 1 ? 'bg-yellow-500 text-white shadow-lg' : p.rank === 2 ? 'bg-slate-400 text-white' : 'bg-orange-700 text-white'}`}>
                    {p.rank === 1 ? '🥇 First Position' : p.rank === 2 ? '🥈 Second Position' : '🥉 Third Position'}
                  </div>
                </div>
              ))}
              {filteredWinners.length === 0 && (
                <div className="py-32 text-center text-blue-900 font-black uppercase tracking-widest opacity-20 border-4 border-dashed border-blue-200 rounded-[3rem]">
                  {searchTerm ? "No Match Found" : "Results Loading..."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SCREEN: SCOREBOARD (DEPT ONLY) --- */}
        {view === 'scoreboard' && (
          <div className="animate-in slide-in-from-right duration-300 pb-20">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-blue-700 font-black mb-10 uppercase text-xs tracking-widest bg-white/50 px-4 py-2 rounded-full"><ChevronLeft size={18}/> Back Home</button>
            <h3 className="text-xl font-black mb-8 uppercase text-blue-900/40 tracking-[0.4em] flex items-center gap-3 justify-center">Department Standings</h3>

            <div className="grid grid-cols-1 gap-6">
              {deptLeaderboard.map((d, i) => (
                <div key={d.name} className={`flex items-center justify-between p-8 rounded-[2.5rem] shadow-2xl relative border-2 overflow-hidden transition-all ${i === 0 ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white border-blue-900 scale-105 z-20 ring-4 ring-yellow-400/30' : 'bg-white/80 backdrop-blur-md text-slate-800 border-white'}`}>
                  {i === 0 && <div className="absolute top-0 right-0 p-4 animate-pulse"><Crown size={48} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" /></div>}
                  <div className="flex items-center gap-6">
                    <span className={`text-2xl font-black italic ${i === 0 ? 'text-yellow-400' : 'text-blue-200'}`}>0{i+1}</span>
                    <span className="font-black text-2xl md:text-3xl uppercase tracking-tighter">{d.name}</span>
                  </div>
                  <div className="text-right"><span className={`text-5xl font-black tabular-nums ${i === 0 ? 'text-white' : 'text-blue-600'}`}>{d.total}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
      
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/90 backdrop-blur-xl border border-blue-100 rounded-full flex items-center gap-4 shadow-2xl z-50">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900 italic">Yoruba '26 Digital Stream</span>
      </footer>
    </div>
  );
};

export default App;
