'use client';

import { useState, useEffect, useCallback } from 'react';

// Standalone Critique Timer - safe to share on screen
export default function CritiqueTimerPage() {
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'warm' | 'cool' | 'open'>('open');
  const [totalTime, setTotalTime] = useState(180); // in seconds
  const [currentStudent, setCurrentStudent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [alertPlayed, setAlertPlayed] = useState(false);

  // Preset times
  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ];

  // Phase colors
  const phaseColors = {
    warm: { bg: '#FFF9E6', border: '#FFE500', text: '#B8860B', label: 'WARM FEEDBACK' },
    cool: { bg: '#F0FDFF', border: '#00D4FF', text: '#0099B8', label: 'COOL FEEDBACK' },
    open: { bg: '#FFFFFF', border: '#1a1f3c', text: '#1a1f3c', label: 'OPEN CRITIQUE' },
  };

  const currentPhaseStyle = phaseColors[phase];

  // Calculate progress percentage
  const progress = totalTime > 0 ? ((totalTime - (minutes * 60 + seconds)) / totalTime) * 100 : 0;

  // Play alert sound (using Web Audio API)
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

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
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

  // Alert when 30 seconds left
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
    setAlertPlayed(false);
  };

  const setPresetTime = (secs: number) => {
    setTotalTime(secs);
    setMinutes(Math.floor(secs / 60));
    setSeconds(secs % 60);
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

  // Format time display
  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: currentPhaseStyle.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: 20,
      transition: 'background 0.3s ease',
    }}>
      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '8px 24px',
        background: '#FFFFFF',
        border: `2px solid ${currentPhaseStyle.border}`,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 700,
        color: currentPhaseStyle.text,
        letterSpacing: 2,
      }}>
        {currentPhaseStyle.label}
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #E8E8E8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {/* Student counter (if multiple students) */}
      {totalStudents > 1 && (
        <div style={{
          position: 'absolute',
          top: 80,
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
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStudent === 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1a1f3c' }}>
            Student {currentStudent} of {totalStudents}
          </span>
          <button
            onClick={nextStudent}
            disabled={currentStudent === totalStudents}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
              opacity: currentStudent === totalStudents ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main timer display */}
      <div style={{
        position: 'relative',
        width: 320,
        height: 320,
        marginBottom: 40,
      }}>
        {/* Progress ring */}
        <svg style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }} width="320" height="320">
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="8"
          />
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke={currentPhaseStyle.border}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 150}`}
            strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        {/* Time display */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 80,
            fontWeight: 300,
            color: minutes === 0 && seconds <= 30 ? '#E74C3C' : currentPhaseStyle.text,
            fontFamily: 'monospace',
            letterSpacing: -2,
            transition: 'color 0.3s ease',
          }}>
            {formatTime(minutes, seconds)}
          </div>
          {minutes === 0 && seconds <= 30 && seconds > 0 && (
            <div style={{
              fontSize: 14,
              color: '#E74C3C',
              fontWeight: 600,
              marginTop: 8,
              animation: 'pulse 1s infinite',
            }}>
              WRAPPING UP
            </div>
          )}
          {minutes === 0 && seconds === 0 && (
            <div style={{
              fontSize: 18,
              color: '#E74C3C',
              fontWeight: 700,
              marginTop: 8,
            }}>
              TIME'S UP!
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            style={{
              padding: '16px 48px',
              background: currentPhaseStyle.border,
              border: 'none',
              borderRadius: 30,
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            START
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={{
              padding: '16px 48px',
              background: '#FFFFFF',
              border: `2px solid ${currentPhaseStyle.border}`,
              borderRadius: 30,
              color: currentPhaseStyle.text,
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
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
            background: '#FFFFFF',
            border: '1px solid #E8E8E8',
            borderRadius: 30,
            color: '#666',
            fontSize: 18,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          RESET
        </button>
      </div>

      {/* Phase selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {(['warm', 'cool', 'open'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            style={{
              padding: '10px 24px',
              background: phase === p ? phaseColors[p].border : '#FFFFFF',
              border: `2px solid ${phaseColors[p].border}`,
              borderRadius: 20,
              color: phase === p ? '#FFFFFF' : phaseColors[p].text,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {p === 'warm' ? '☀️ Warm' : p === 'cool' ? '❄️ Cool' : '💬 Open'}
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
          background: '#FFFFFF',
          borderTop: '1px solid #E8E8E8',
          padding: '20px 40px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 8 }}>
                TIME PRESETS
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {presets.map(preset => (
                  <button
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    style={{
                      padding: '8px 16px',
                      background: totalTime === preset.seconds ? '#1a1f3c' : '#FFFFFF',
                      border: '1px solid #E8E8E8',
                      borderRadius: 8,
                      color: totalTime === preset.seconds ? '#FFFFFF' : '#666',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 8 }}>
                NUMBER OF STUDENTS (for gallery walk)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E8',
                    fontSize: 20,
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: 24, fontWeight: 600, color: '#1a1f3c', minWidth: 40, textAlign: 'center' }}>
                  {totalStudents}
                </span>
                <button
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E8',
                    fontSize: 20,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 12 }}>
                  Total time: {totalStudents * Math.ceil(totalTime / 60)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
