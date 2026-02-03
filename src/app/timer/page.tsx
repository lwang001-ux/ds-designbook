'use client';

import { useState, useEffect, useCallback } from 'react';

// Itten's color wheel - pure, flat colors inspired by "The Art of Color"
const COLOR_OPTIONS = [
  { name: 'Red', color: '#E4002B' },      // Itten primary red
  { name: 'Yellow', color: '#FFD300' },   // Itten primary yellow
  { name: 'Blue', color: '#0057B8' },     // Itten primary blue
  { name: 'Orange', color: '#FF6900' },   // Itten secondary orange
  { name: 'Green', color: '#00843D' },    // Itten secondary green
  { name: 'Violet', color: '#6B3FA0' },   // Itten secondary violet
  { name: 'Black', color: '#000000' },    // Pure black
];

// Flip Clock Digit Component - Bauhaus-inspired flat design
const FlipDigit = ({ digit, color }: { digit: string; color: string }) => {
  return (
    <div style={{
      position: 'relative',
      width: 100,
      height: 140,
    }}>
      {/* Card - solid color, no gradients */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: color,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {/* Top half */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: color,
          overflow: 'hidden',
          borderBottom: '3px solid rgba(0,0,0,0.3)',
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
          background: color,
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
          }}>
            {digit}
          </span>
        </div>

        {/* Center divider line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(0,0,0,0.3)',
          transform: 'translateY(-50%)',
        }} />

        {/* Side notches */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: -3,
          width: 6,
          height: 12,
          background: '#FFFFFF',
          borderRadius: '0 4px 4px 0',
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: -3,
          width: 6,
          height: 12,
          background: '#FFFFFF',
          borderRadius: '4px 0 0 4px',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </div>
  );
};

// Classroom Timer - Itten/Bauhaus inspired
export default function TimerPage() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(300);
  const [currentStudent, setCurrentStudent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const currentColor = COLOR_OPTIONS[selectedColor].color;

  const presets = [
    { label: '1', seconds: 60 },
    { label: '2', seconds: 120 },
    { label: '3', seconds: 180 },
    { label: '5', seconds: 300 },
    { label: '10', seconds: 600 },
    { label: '50', seconds: 3000 },
    { label: '55', seconds: 3300 },
    { label: '60', seconds: 3600 },
    { label: '70', seconds: 4200 },
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
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: 20,
    }}>
      {/* Title - Bauhaus typography */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 14,
        fontWeight: 700,
        color: '#000000',
        letterSpacing: 6,
        textTransform: 'uppercase',
      }}>
        Timer
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: 0,
          background: '#000000',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
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
          gap: 20,
        }}>
          <button
            onClick={prevStudent}
            disabled={currentStudent === 1}
            style={{
              width: 32,
              height: 32,
              background: currentStudent === 1 ? '#CCCCCC' : '#000000',
              border: 'none',
              cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            letterSpacing: 2,
          }}>
            {currentStudent} / {totalStudents}
          </span>
          <button
            onClick={nextStudent}
            disabled={currentStudent === totalStudents}
            style={{
              width: 32,
              height: 32,
              background: currentStudent === totalStudents ? '#CCCCCC' : '#000000',
              border: 'none',
              cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Main flip clock display */}
      <div style={{
        marginBottom: 60,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Minutes */}
          <FlipDigit digit={minTens} color={currentColor} />
          <FlipDigit digit={minOnes} color={currentColor} />

          {/* Colon - simple squares */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '0 8px',
          }}>
            <div style={{
              width: 16,
              height: 16,
              background: currentColor,
            }} />
            <div style={{
              width: 16,
              height: 16,
              background: currentColor,
            }} />
          </div>

          {/* Seconds */}
          <FlipDigit digit={secTens} color={currentColor} />
          <FlipDigit digit={secOnes} color={currentColor} />
        </div>

        {/* Status messages */}
        {isUrgent && (
          <div style={{
            textAlign: 'center',
            marginTop: 30,
            fontSize: 14,
            fontWeight: 700,
            color: currentColor,
            letterSpacing: 4,
            animation: 'blink 1s infinite',
          }}>
            ALMOST DONE
          </div>
        )}

        {isComplete && (
          <div style={{
            textAlign: 'center',
            marginTop: 30,
            fontSize: 18,
            fontWeight: 700,
            color: currentColor,
            letterSpacing: 4,
          }}>
            TIME
          </div>
        )}
      </div>

      {/* Controls - geometric Bauhaus buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            style={{
              padding: '16px 50px',
              background: currentColor,
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 4,
            }}
          >
            START
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={{
              padding: '16px 50px',
              background: '#FFFFFF',
              border: `3px solid ${currentColor}`,
              color: currentColor,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 4,
            }}
          >
            PAUSE
          </button>
        )}
        <button
          onClick={resetTimer}
          style={{
            padding: '16px 30px',
            background: '#FFFFFF',
            border: '3px solid #000000',
            color: '#000000',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 4,
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
          borderTop: '3px solid #000000',
          padding: '30px 40px',
        }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            {/* Time Presets */}
            <div style={{ marginBottom: 30 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#000000',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 3,
              }}>
                MINUTES
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {presets.map(preset => (
                  <button
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    style={{
                      width: 50,
                      height: 50,
                      background: totalTime === preset.seconds ? currentColor : '#FFFFFF',
                      border: totalTime === preset.seconds ? 'none' : '2px solid #000000',
                      color: totalTime === preset.seconds ? '#FFFFFF' : '#000000',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clock Color - Itten color wheel */}
            <div style={{ marginBottom: 30 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#000000',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 3,
              }}>
                COLOR
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {COLOR_OPTIONS.map((option, index) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedColor(index)}
                    style={{
                      width: 40,
                      height: 40,
                      background: option.color,
                      border: selectedColor === index ? '3px solid #000000' : 'none',
                      cursor: 'pointer',
                    }}
                    title={option.name}
                  />
                ))}
              </div>
            </div>

            {/* Student Counter */}
            <div>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#000000',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 3,
              }}>
                STUDENTS
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    background: '#FFFFFF',
                    border: '2px solid #000000',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#000000',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#000000',
                  minWidth: 40,
                  textAlign: 'center',
                }}>
                  {totalStudents}
                </span>
                <button
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    background: '#FFFFFF',
                    border: '2px solid #000000',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#000000',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
                {totalStudents > 1 && (
                  <span style={{
                    fontSize: 12,
                    color: '#666666',
                    marginLeft: 12,
                    letterSpacing: 1,
                  }}>
                    {totalStudents * Math.ceil(totalTime / 60)} min total
                  </span>
                )}
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
      `}</style>
    </div>
  );
}
