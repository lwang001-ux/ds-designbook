'use client';

import { useState, useEffect, useCallback } from 'react';

// Flip Clock Digit Component
const FlipDigit = ({ digit, prevDigit, isFlipping }: { digit: string; prevDigit: string; isFlipping: boolean }) => {
  return (
    <div style={{
      position: 'relative',
      width: 100,
      height: 140,
      perspective: '200px',
    }}>
      {/* Card container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#1a1a1a',
        borderRadius: 8,
        boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        {/* Top half - static showing current digit */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          overflow: 'hidden',
          borderBottom: '2px solid #0a0a0a',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 120,
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            color: '#f0f0e8',
            lineHeight: 1,
            transform: 'translateY(50%)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            {digit}
          </span>
        </div>

        {/* Bottom half - static showing current digit */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #151515 100%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 120,
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            color: '#e8e8e0',
            lineHeight: 1,
            transform: 'translateY(-50%)',
            textShadow: '0 -1px 2px rgba(0,0,0,0.5)',
          }}>
            {digit}
          </span>
        </div>

        {/* Center line highlight */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 2,
          background: '#0a0a0a',
          transform: 'translateY(-50%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.05)',
        }} />

        {/* Side notches */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: -4,
          width: 8,
          height: 12,
          background: '#0a0a0a',
          borderRadius: '0 6px 6px 0',
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: -4,
          width: 8,
          height: 12,
          background: '#0a0a0a',
          borderRadius: '6px 0 0 6px',
          transform: 'translateY(-50%)',
        }} />
      </div>

      {/* Inner shadow overlay for depth */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 8,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

// Standalone Critique Timer - 1970's Flip Clock Style
export default function CritiqueTimerPage() {
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'warm' | 'cool' | 'open'>('open');
  const [totalTime, setTotalTime] = useState(180);
  const [currentStudent, setCurrentStudent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [prevMinutes, setPrevMinutes] = useState(3);
  const [prevSeconds, setPrevSeconds] = useState(0);

  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ];

  const phaseColors = {
    warm: { accent: '#FFE500', label: 'WARM FEEDBACK', icon: '☀️' },
    cool: { accent: '#00D4FF', label: 'COOL FEEDBACK', icon: '❄️' },
    open: { accent: '#EC008C', label: 'OPEN CRITIQUE', icon: '💬' },
  };

  const currentPhase = phaseColors[phase];

  const playAlert = useCallback(() => {
    if (alertPlayed) return;
    setAlertPlayed(true);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [alertPlayed]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setPrevMinutes(minutes);
        setPrevSeconds(seconds);

        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            playAlert();
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, playAlert]);

  useEffect(() => {
    if (isRunning && minutes === 0 && seconds === 30 && !alertPlayed) {
      playAlert();
    }
  }, [isRunning, minutes, seconds, alertPlayed, playAlert]);

  const startTimer = () => {
    setIsRunning(true);
    setAlertPlayed(false);
    setShowSettings(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(Math.floor(totalTime / 60));
    setSeconds(totalTime % 60);
    setPrevMinutes(Math.floor(totalTime / 60));
    setPrevSeconds(totalTime % 60);
    setAlertPlayed(false);
  };

  const setPresetTime = (secs: number) => {
    setTotalTime(secs);
    setMinutes(Math.floor(secs / 60));
    setSeconds(secs % 60);
    setPrevMinutes(Math.floor(secs / 60));
    setPrevSeconds(secs % 60);
    setAlertPlayed(false);
  };

  const nextStudent = () => {
    if (currentStudent < totalStudents) {
      setCurrentStudent(c => c + 1);
      resetTimer();
    }
  };

  const prevStudent = () => {
    if (currentStudent > 1) {
      setCurrentStudent(c => c - 1);
      resetTimer();
    }
  };

  // Get individual digits
  const minTens = Math.floor(minutes / 10).toString();
  const minOnes = (minutes % 10).toString();
  const secTens = Math.floor(seconds / 10).toString();
  const secOnes = (seconds % 10).toString();

  const prevMinTens = Math.floor(prevMinutes / 10).toString();
  const prevMinOnes = (prevMinutes % 10).toString();
  const prevSecTens = Math.floor(prevSeconds / 10).toString();
  const prevSecOnes = (prevSeconds % 10).toString();

  const isUrgent = minutes === 0 && seconds <= 30;
  const isComplete = minutes === 0 && seconds === 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: 20,
    }}>
      {/* Phase indicator - LED style */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 24px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        border: '1px solid #333',
      }}>
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: currentPhase.accent,
          boxShadow: `0 0 10px ${currentPhase.accent}, 0 0 20px ${currentPhase.accent}`,
        }} />
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#e0e0e0',
          letterSpacing: 2,
        }}>
          {currentPhase.label}
        </span>
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#2a2a2a',
          border: '1px solid #444',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {/* Student counter */}
      {totalStudents > 1 && (
        <div style={{
          position: 'absolute',
          top: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <button
            onClick={prevStudent}
            disabled={currentStudent === 1}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#2a2a2a',
              border: '1px solid #444',
              cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStudent === 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#e0e0e0' }}>
            Student {currentStudent} of {totalStudents}
          </span>
          <button
            onClick={nextStudent}
            disabled={currentStudent === totalStudents}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#2a2a2a',
              border: '1px solid #444',
              cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
              opacity: currentStudent === totalStudents ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main flip clock display */}
      <div style={{
        background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 10%, #0a0a0a 100%)',
        padding: '30px 40px',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '1px solid #333',
        marginBottom: 40,
      }}>
        {/* Wood grain base accent */}
        <div style={{
          position: 'relative',
        }}>
          {/* Urgent glow effect */}
          {isUrgent && !isComplete && (
            <div style={{
              position: 'absolute',
              top: -20,
              left: -20,
              right: -20,
              bottom: -20,
              background: 'radial-gradient(ellipse at center, rgba(231, 76, 60, 0.2) 0%, transparent 70%)',
              animation: 'urgentPulse 1s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Minutes */}
            <FlipDigit digit={minTens} prevDigit={prevMinTens} isFlipping={minTens !== prevMinTens} />
            <FlipDigit digit={minOnes} prevDigit={prevMinOnes} isFlipping={minOnes !== prevMinOnes} />

            {/* Colon separator */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              padding: '0 8px',
            }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: isRunning ? currentPhase.accent : '#444',
                boxShadow: isRunning ? `0 0 10px ${currentPhase.accent}` : 'none',
                transition: 'all 0.3s ease',
              }} />
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: isRunning ? currentPhase.accent : '#444',
                boxShadow: isRunning ? `0 0 10px ${currentPhase.accent}` : 'none',
                transition: 'all 0.3s ease',
              }} />
            </div>

            {/* Seconds */}
            <FlipDigit digit={secTens} prevDigit={prevSecTens} isFlipping={secTens !== prevSecTens} />
            <FlipDigit digit={secOnes} prevDigit={prevSecOnes} isFlipping={secOnes !== prevSecOnes} />
          </div>

          {/* Status messages */}
          {isUrgent && !isComplete && (
            <div style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 14,
              fontWeight: 700,
              color: '#E74C3C',
              letterSpacing: 3,
              animation: 'blink 1s infinite',
            }}>
              ⚠ WRAPPING UP
            </div>
          )}

          {isComplete && (
            <div style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 16,
              fontWeight: 700,
              color: currentPhase.accent,
              letterSpacing: 3,
              textShadow: `0 0 10px ${currentPhase.accent}`,
            }}>
              ✓ TIME'S UP!
            </div>
          )}
        </div>
      </div>

      {/* Controls - retro button style */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            style={{
              padding: '16px 48px',
              background: `linear-gradient(180deg, ${currentPhase.accent} 0%, ${currentPhase.accent}dd 100%)`,
              border: 'none',
              borderRadius: 8,
              color: '#000',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: `0 4px 15px ${currentPhase.accent}66`,
              letterSpacing: 2,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            START
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(180deg, #444 0%, #333 100%)',
              border: `2px solid ${currentPhase.accent}`,
              borderRadius: 8,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              letterSpacing: 2,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
            PAUSE
          </button>
        )}
        <button
          onClick={resetTimer}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(180deg, #333 0%, #222 100%)',
            border: '1px solid #444',
            borderRadius: 8,
            color: '#888',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: 2,
          }}
        >
          RESET
        </button>
      </div>

      {/* Phase selector - toggle switch style */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: 6,
        background: '#1a1a1a',
        borderRadius: 30,
        border: '1px solid #333',
      }}>
        {(['warm', 'cool', 'open'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '10px 24px',
              background: phase === p
                ? `linear-gradient(180deg, ${phaseColors[p].accent} 0%, ${phaseColors[p].accent}cc 100%)`
                : 'transparent',
              border: 'none',
              borderRadius: 24,
              color: phase === p ? '#000' : '#666',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 1,
              transition: 'all 0.2s ease',
            }}
          >
            {phaseColors[p].icon} {p}
          </button>
        ))}
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderTop: '1px solid #444',
          padding: '24px 40px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10, letterSpacing: 2 }}>
                TIME PRESETS
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {presets.map(preset => (
                  <button
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    style={{
                      padding: '10px 18px',
                      background: totalTime === preset.seconds
                        ? `linear-gradient(180deg, ${currentPhase.accent} 0%, ${currentPhase.accent}cc 100%)`
                        : '#333',
                      border: totalTime === preset.seconds ? 'none' : '1px solid #444',
                      borderRadius: 6,
                      color: totalTime === preset.seconds ? '#000' : '#888',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#666', display: 'block', marginBottom: 10, letterSpacing: 2 }}>
                STUDENTS (GALLERY WALK)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: '#333',
                    border: '1px solid #444',
                    fontSize: 20,
                    color: '#888',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#e0e0e0',
                  minWidth: 50,
                  textAlign: 'center',
                  fontFamily: "'Courier New', monospace",
                }}>
                  {totalStudents}
                </span>
                <button
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: '#333',
                    border: '1px solid #444',
                    fontSize: 20,
                    color: '#888',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: 12, color: '#666', marginLeft: 12 }}>
                  Total: {totalStudents * Math.ceil(totalTime / 60)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes urgentPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
