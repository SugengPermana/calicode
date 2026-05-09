import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Terminal, Timer, Dumbbell, Award, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Routine {
  id: string | number;
  duration: number;
  name: string;
  description: string;
  exercises: string[];
  isCustom?: boolean;
}

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: 1,
    duration: 1,
    name: "Quick Reboot",
    description: "Short mobility burst to clear the cache.",
    exercises: ["Neck 360s", "Shoulder Rolls", "Wrist Circles", "Deep Breaths"]
  },
  {
    id: 2,
    duration: 5,
    name: "Arch Body Holds & Core",
    description: "Strengthen your posterior chain and core stability.",
    exercises: ["Arch Body Holds (3 sets)", "Hollow Body Holds (3 sets)", "L-Sit Progressions", "Plank Variations"]
  },
  {
    id: 3,
    duration: 10,
    name: "Ring Chest Flys & Push ups",
    description: "Focus on upper body strength and shoulder stability.",
    exercises: ["Push-up Variations", "Ring Chest Flys", "Scapula Push-ups", "Diamond Push-ups"]
  },
  {
    id: 4,
    duration: 15,
    name: "Pull-up Fundamentals & Dips",
    description: "Developing pulling power and vertical push strength.",
    exercises: ["Active Hangs", "Negative Pull-ups", "Bar Dips", "Inverted Rows"]
  },
  {
    id: 5,
    duration: 20,
    name: "Handstand Practice & Tuck Front Levers",
    description: "Balance, stability, and high-level static strength.",
    exercises: ["Wall Walks", "Kick-up Practice", "Tuck Front Lever Holds", "Scapula Pull-ups"]
  },
  {
    id: 6,
    duration: 30,
    name: "Full Muscle-Up Progressions",
    description: "Mastering the explosive transition from pull to push.",
    exercises: ["Explosive Pull-ups", "Dips (Straight Bar)", "The Transition Practice", "False Grip Training"]
  }
];

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customRoutines, setCustomRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('calicode_custom_routines');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Custom Routine Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDuration, setNewRoutineDuration] = useState(5);
  const [newRoutineExercise, setNewRoutineExercise] = useState('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('calicode_custom_routines', JSON.stringify(customRoutines));
  }, [customRoutines]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateRoutine = () => {
    if (!selectedDuration) return;
    const allRoutines = [...DEFAULT_ROUTINES, ...customRoutines];
    const routinesWithDuration = allRoutines.filter(r => r.duration === selectedDuration);
    if (routinesWithDuration.length > 0) {
      const routine = routinesWithDuration[0];
      setCurrentRoutine(routine);
      setTimeLeft(routine.duration * 60);
      setIsActive(false);
      setIsCompleted(false);
    }
  };

  const selectCustomRoutine = (routine: Routine) => {
    setCurrentRoutine(routine);
    setTimeLeft(routine.duration * 60);
    setIsActive(false);
    setIsCompleted(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    if (currentRoutine) {
      setTimeLeft(currentRoutine.duration * 60);
      setIsActive(false);
      setIsCompleted(false);
    }
  };

  const markAsDone = () => {
    setIsCompleted(true);
    setIsActive(false);
    setTimeLeft(0);
  };

  const addExercise = () => {
    if (newRoutineExercise.trim()) {
      setNewRoutineExercises([...newRoutineExercises, newRoutineExercise.trim()]);
      setNewRoutineExercise('');
    }
  };

  const saveCustomRoutine = () => {
    if (!newRoutineName.trim() || newRoutineExercises.length === 0) return;
    const routine: Routine = {
      id: `custom_${Date.now()}`,
      name: newRoutineName.trim(),
      duration: newRoutineDuration,
      exercises: newRoutineExercises,
      description: "Custom user-generated routine.",
      isCustom: true
    };
    setCustomRoutines([...customRoutines, routine]);
    setIsCreating(false);
    setNewRoutineName('');
    setNewRoutineExercises([]);
    setNewRoutineExercise('');
  };

  const deleteCustomRoutine = (id: string | number) => {
    setCustomRoutines(customRoutines.filter(r => r.id !== id));
    if (currentRoutine?.id === id) setCurrentRoutine(null);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsCompleted(true);
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col font-sans select-none overflow-hidden">
      {/* Header */}
      <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur-md shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
            CaliCode
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-emerald-500/70 font-mono uppercase">System Health</span>
            <span className="text-xs font-mono">CORE_TEMP: 38°C</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </header>

      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Duration Picker */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-2xl shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Standard Durations</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 5, 10, 15, 20, 30].map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    setSelectedDuration(duration);
                    setIsCreating(false);
                  }}
                  className={`
                    py-3 px-2 rounded-lg border transition-all font-mono text-sm
                    ${selectedDuration === duration 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/50'}
                  `}
                >
                  {duration}m
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerateRoutine}
              disabled={!selectedDuration}
              className={`
                w-full mt-4 py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase text-[10px] tracking-widest font-bold
                ${selectedDuration 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
              `}
            >
              Generate Standard Routine
            </button>
          </section>

          {/* Custom Routines List */}
          <section className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Custom Scripts</h2>
              <button 
                onClick={() => setIsCreating(true)}
                className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-all border border-emerald-500/30"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
              {customRoutines.length === 0 ? (
                <p className="text-[10px] text-slate-600 font-mono italic">No custom routines found.</p>
              ) : (
                customRoutines.map((r) => (
                  <div key={r.id} className="group flex items-center justify-between bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                    <button 
                      onClick={() => selectCustomRoutine(r)}
                      className="flex-1 text-left"
                    >
                      <div className="text-xs font-bold text-slate-300">{r.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.duration}m // {r.exercises.length} steps</div>
                    </button>
                    <button 
                      onClick={() => deleteCustomRoutine(r.id)}
                      className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Exercise Details Overlay */}
          {currentRoutine && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-5 flex flex-col shrink-0"
            >
              <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4 font-mono">Current Sequence</h2>
              <ul className="space-y-3 font-mono text-[11px] text-slate-400">
                {currentRoutine.exercises.map((ex, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500/50">0{i+1}.</span>
                    <span className={isActive && timeLeft > 0 ? "animate-pulse" : ""}>{ex}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-y-auto relative custom-scrollbar">
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div 
                key="creative"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-emerald-400 font-mono text-xs uppercase tracking-widest">// Define New Routine</h3>
                  <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-300"><X size={20}/></button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 overflow-y-auto custom-scrollbar pr-2">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 font-mono block mb-2">Routine name</label>
                      <input 
                        type="text" 
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                        placeholder="e.g. MORNING_BURN"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 font-mono block mb-2">Duration (minutes)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="60"
                        value={newRoutineDuration}
                        onChange={(e) => setNewRoutineDuration(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-slate-500 font-mono block mb-2">Steps / Exercises</label>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={newRoutineExercise}
                        onChange={(e) => setNewRoutineExercise(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addExercise()}
                        placeholder="Add exercise..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition-colors font-mono"
                      />
                      <button onClick={addExercise} className="bg-emerald-500/20 text-emerald-400 px-4 rounded-lg border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all">
                        <Plus size={18}/>
                      </button>
                    </div>
                    <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg p-4 overflow-y-auto custom-scrollbar max-h-[200px]">
                      {newRoutineExercises.length === 0 ? (
                        <p className="text-[10px] text-slate-600 font-mono">No steps added yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {newRoutineExercises.map((ex, i) => (
                            <li key={i} className="flex justify-between items-center text-xs text-slate-400 font-mono">
                              <span>0{i+1}. {ex}</span>
                              <button onClick={() => setNewRoutineExercises(newRoutineExercises.filter((_, idx)=> idx !== i))} className="text-red-500/50 hover:text-red-500">
                                <X size={12}/>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-800 flex justify-end">
                  <button 
                    onClick={saveCustomRoutine}
                    disabled={!newRoutineName.trim() || newRoutineExercises.length === 0}
                    className="px-12 py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Deploy Routine
                  </button>
                </div>
              </motion.div>
            ) : !currentRoutine ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/10"
              >
                <Terminal size={48} className="mb-4 opacity-10" />
                <p className="font-mono text-sm uppercase tracking-widest text-slate-500">Awaiting Subroutine Deployment</p>
              </motion.div>
            ) : isCompleted ? (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="bg-emerald-500/20 p-6 rounded-full border border-emerald-500/30 mb-6">
                  <Award size={64} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tighter">EXECUTION_SUCCESS</h2>
                <p className="text-emerald-400/60 font-mono text-xs mb-8 uppercase tracking-widest">
                  System updated. Gains successfully compiled.
                </p>
                <button 
                  onClick={() => setCurrentRoutine(null)}
                  className="px-8 py-3 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-all text-xs tracking-widest uppercase font-mono"
                >
                  Terminate Session
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="timer"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col relative"
              >
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-white mt-2 tracking-tight">
                    {currentRoutine.name}
                  </h2>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-[140px] font-mono font-bold leading-none tracking-tighter text-white tabular-nums drop-shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex gap-4 mt-12 w-full max-w-sm">
                    <button
                      onClick={toggleTimer}
                      className={`
                        flex-1 font-bold py-4 rounded-lg transition-all text-xs tracking-widest uppercase
                        ${isActive 
                          ? 'bg-slate-800 text-white hover:bg-slate-700' 
                          : 'bg-white text-slate-950 hover:bg-slate-200'}
                      `}
                    >
                      {isActive ? 'PAUSE' : 'START'}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="flex-1 bg-slate-800/50 text-slate-400 font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors text-xs tracking-widest uppercase"
                    >
                      RETRY
                    </button>
                  </div>
                </div>

                <div className="mt-auto border-t border-slate-800 pt-6 flex justify-between items-center">
                  <div className="flex gap-10">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-mono tracking-widest">Priority</div>
                      <div className="text-emerald-400 font-bold font-mono text-sm uppercase">Critical</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500 font-mono tracking-widest">Type</div>
                      <div className="text-white font-bold font-mono text-sm uppercase">{currentRoutine.isCustom ? 'CUSTOM_HOOK' : 'INTERNAL_LIB'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={markAsDone}
                    className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-6 py-2.5 rounded-full text-[10px] font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all font-mono uppercase tracking-widest"
                  >
                    MARK_COMPLETED
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="h-10 bg-emerald-600 text-emerald-950 flex items-center px-6 justify-between text-[10px] font-bold uppercase tracking-tighter shrink-0">
        <div className="flex gap-4 items-center font-mono">
          <span>SYSTEM: OPTIMAL</span>
          <span className="opacity-50">|</span>
          <span>CURR_TASK: {currentRoutine ? currentRoutine.name.toUpperCase().replace(/\s+/g, '_') : 'WAIT_FOR_JOB'}</span>
        </div>
        <div className="animate-pulse font-mono flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-950 rounded-full"></div>
          KEEP PUSHING_CODE & PUSHING_LIMITS //
        </div>
      </footer>
    </div>
  );
}
