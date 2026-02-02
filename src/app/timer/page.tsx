'use client';

import { useState, useEffect, useCallback } from 'react';

// Primary color options for the clock
const COLOR_OPTIONS = [
  { name: 'Red', main: '#E63946', light: '#FF6B6B', dark: '#C1121F' },
  { name: 'Blue', main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8' },
  { name: 'Yellow', main: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  { name: 'Green', main: '#16A34A', light: '#4ADE80', dark: '#15803D' },
  { name: 'Black', main: '#1F2937', light: '#4B5563', dark: '#111827' },
];

// Flip Clock Digit Component
const FlipDigit = ({ digit, color }: { digit: string; color: typeof COLOR_OPTIONS[0] }) => {
  return (
    <div style={{
      position: 'relative',
      width: 100,
      height: 140,
    }}>
      {/* Card container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: color.main,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>
        {/* Top half */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(180deg, ${color.light} 0%, ${color.main} 100%)`,
          overflow: 'hidden',
          borderBottom: '3px solid',
          borderBottomColor: color.dark,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 120,
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1,
            transform: 'translateY(50%)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            {digit}
          </span>
        </div>

        {/* Bottom half */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(180deg, ${color.main} 0%, ${color.dark} 100%)`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 120,
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1,
            transform: 'translateY(-50%)',
            textShadow: '0 -1px 2px rgba(0,0,0,0.2)',
          }}>
            {digit}
          </span>
        </div>

        {/* Center line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 3,
          background: color.dark,
          transform: 'translateY(-50%)',
        }} />

        {/* Glossy reflection */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '12px 12px 0 0',
          pointerEvents: 'none',
        }} />

        {/* Side notches */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: -4,
          width: 8,
          height: 14,
          background: color.dark,
          borderRadius: '0 6px 6px 0',
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: -4,
          width: 8,
          height: 14,
          background: color.dark,
          borderRadius: '6px 0 0 6px',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </div>
  );
};

// Standalone Classroom Timer - 1970's Flip Clock Style
export default function TimerPage() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(300);
  const [currentStudent, setCurrentStudent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0); // Index into COLOR_OPTIONS

  const currentColor = COLOR_OPTIONS[selectedColor];

  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ];

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

  // Get individual digits
  const minTens = Math.floor(minutes / 10).toString();
  const minOnes = (minutes % 10).toString();
  const secTens = Math.floor(seconds / 10).toString();
  const secOnes = (seconds % 10).toString();

  const isUrgent = minutes === 0 && seconds <= 30 && seconds > 0;
  const isComplete = minutes === 0 && seconds === 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: 20,
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 18,
        fontWeight: 700,
        color: '#1a1f3c',
        letterSpacing: 1,
      }}>
        CLASSROOM TIMER
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
          background: '#FFFFFF',
          border: '2px solid #E8E8E8',
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

      {/* Student counter */}
      {totalStudents > 1 && (
        <div style={{
          position: 'absolute',
          top: 70,
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
              border: `2px solid ${currentColor.main}`,
              cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStudent === 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={currentColor.main} strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1f3c' }}>
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
              border: `2px solid ${currentColor.main}`,
              cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
              opacity: currentStudent === totalStudents ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={currentColor.main} strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main flip clock display */}
      <div style={{
        padding: '30px 40px',
        marginBottom: 50,
      }}>
        <div style={{
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Minutes */}
            <FlipDigit digit={minTens} color={currentColor} />
            <FlipDigit digit={minOnes} color={currentColor} />

            {/* Colon separator */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              padding: '0 8px',
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: currentColor.main,
              }} />
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: currentColor.main,
              }} />
            </div>

            {/* Seconds */}
            <FlipDigit digit={secTens} color={currentColor} />
            <FlipDigit digit={secOnes} color={currentColor} />
          </div>

          {/* Status messages */}
          {isUrgent && (
            <div style={{
              position: 'absolute',
              bottom: -45,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 16,
              fontWeight: 700,
              color: currentColor.main,
              letterSpacing: 3,
              animation: 'blink 1s infinite',
            }}>
              ALMOST DONE!
            </div>
          )}

          {isComplete && (
            <div style={{
              position: 'absolute',
              bottom: -45,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 20,
              fontWeight: 700,
              color: currentColor.main,
              letterSpacing: 3,
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
              background: currentColor.main,
              border: 'none',
              borderRadius: 30,
              color: '#FFFFFF',
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
              border: `3px solid ${currentColor.main}`,
              borderRadius: 30,
              color: currentColor.main,
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
            background: '#FFFFFF',
            border: '2px solid #E8E8E8',
            borderRadius: 30,
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

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #E8E8E8',
          padding: '24px 40px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Time Presets */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 10, letterSpacing: 2 }}>
                TIME
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {presets.map(preset => (
                  <button
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    style={{
                      padding: '10px 18px',
                      background: totalTime === preset.seconds ? currentColor.main : '#FFFFFF',
                      border: totalTime === preset.seconds ? 'none' : '2px solid #E8E8E8',
                      borderRadius: 20,
                      color: totalTime === preset.seconds ? '#FFFFFF' : '#666',
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

            {/* Clock Color */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 10, letterSpacing: 2 }}>
                CLOCK COLOR
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {COLOR_OPTIONS.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: color.main,
                      border: selectedColor === index ? '3px solid #1a1f3c' : '3px solid transparent',
                      cursor: 'pointer',
                      outline: selectedColor === index ? '2px solid #FFFFFF' : 'none',
                      outlineOffset: -5,
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Student Counter */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#888', display: 'block', marginBottom: 10, letterSpacing: 2 }}>
                STUDENT ROTATION
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `2px solid ${currentColor.main}`,
                    fontSize: 20,
                    color: currentColor.main,
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: currentColor.main,
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
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `2px solid ${currentColor.main}`,
                    fontSize: 20,
                    color: currentColor.main,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 12 }}>
                  {totalStudents === 1 ? 'No rotation' : `Total: ${totalStudents * Math.ceil(totalTime / 60)} min`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
