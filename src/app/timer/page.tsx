'use client';

import { useState, useEffect, useCallback } from 'react';

// Dieter Rams / Braun inspired color palette
const COLOR_OPTIONS = [
  { name: 'Braun Black', color: '#1a1a1a' },
  { name: 'Braun Green', color: '#4A7C59' },    // Classic Braun green
  { name: 'Braun Orange', color: '#E86A33' },   // Braun accent orange
  { name: 'Snow White', color: '#F5F5F5' },
  { name: 'Warm Grey', color: '#8B8680' },
];

// Flip Clock Digit - Braun/Rams inspired
const FlipDigit = ({ digit, color, isLight }: { digit: string; color: string; isLight: boolean }) => {
  return (
    <div style={{
      position: 'relative',
      width: 90,
      height: 130,
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: color,
        borderRadius: 6,
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
          borderBottom: `2px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 100,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 300,
            color: isLight ? '#1a1a1a' : '#FFFFFF',
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
            fontSize: 100,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 300,
            color: isLight ? '#1a1a1a' : '#FFFFFF',
            lineHeight: 1,
            transform: 'translateY(-50%)',
          }}>
            {digit}
          </span>
        </div>

        {/* Center divider */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 2,
          background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </div>
  );
};

// Braun-style circular button
const BraunButton = ({
  onClick,
  active,
  children,
  color = '#1a1a1a',
  size = 50
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  color?: string;
  size?: number;
}) => (
  <button
    onClick={onClick}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: active ? color : '#FFFFFF',
      border: `2px solid ${color}`,
      color: active ? '#FFFFFF' : color,
      fontSize: size > 40 ? 14 : 11,
      fontWeight: 500,
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
    }}
  >
    {children}
  </button>
);

// Timer - Dieter Rams / Braun Design
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
  const isLightColor = selectedColor === 3; // Snow White

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

      oscillator.frequency.value = 660;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.2;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 400);
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
      background: '#F8F7F5', // Warm off-white like Braun products
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: 20,
    }}>
      {/* Braun-inspired product housing */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '40px 50px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        position: 'relative',
      }}>
        {/* Braun logo area - minimal text */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 24,
          fontSize: 10,
          fontWeight: 500,
          color: '#999',
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          Timer
        </div>

        {/* Settings button - Braun style */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: showSettings ? '#1a1a1a' : '#FFFFFF',
            border: '1px solid #E0E0E0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={showSettings ? '#FFFFFF' : '#666'} strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </button>

        {/* Student counter */}
        {totalStudents > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20,
            marginTop: 10,
          }}>
            <button
              onClick={prevStudent}
              disabled={currentStudent === 1}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: currentStudent === 1 ? '#E8E8E8' : '#1a1a1a',
                border: 'none',
                cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#666',
              letterSpacing: 1,
            }}>
              {currentStudent} of {totalStudents}
            </span>
            <button
              onClick={nextStudent}
              disabled={currentStudent === totalStudents}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: currentStudent === totalStudents ? '#E8E8E8' : '#1a1a1a',
                border: 'none',
                cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Clock display */}
        <div style={{ marginBottom: 30 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <FlipDigit digit={minTens} color={currentColor} isLight={isLightColor} />
            <FlipDigit digit={minOnes} color={currentColor} isLight={isLightColor} />

            {/* Colon - Braun style dots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: '0 6px',
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: currentColor,
              }} />
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: currentColor,
              }} />
            </div>

            <FlipDigit digit={secTens} color={currentColor} isLight={isLightColor} />
            <FlipDigit digit={secOnes} color={currentColor} isLight={isLightColor} />
          </div>

          {/* Status */}
          {isUrgent && (
            <div style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 11,
              fontWeight: 500,
              color: '#E86A33',
              letterSpacing: 2,
              animation: 'pulse 1s infinite',
            }}>
              FINISHING
            </div>
          )}

          {isComplete && (
            <div style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 12,
              fontWeight: 500,
              color: currentColor,
              letterSpacing: 2,
            }}>
              COMPLETE
            </div>
          )}
        </div>

        {/* Controls - Braun calculator style */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}>
          {!isRunning ? (
            <BraunButton onClick={startTimer} active color="#4A7C59" size={56}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </BraunButton>
          ) : (
            <BraunButton onClick={pauseTimer} color="#E86A33" size={56}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </BraunButton>
          )}
          <BraunButton onClick={resetTimer} size={56}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </BraunButton>
        </div>

        {/* Dieter Rams quote - subtle */}
        <div style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 9,
          color: '#BBB',
          fontStyle: 'italic',
          letterSpacing: 0.5,
        }}>
          "Less, but better"
        </div>
      </div>

      {/* Settings panel - Braun control panel style */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #E8E8E8',
          padding: '24px 30px',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Time Presets - Grid of circular buttons like Braun calculator */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#999',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
                Minutes
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {presets.map(preset => (
                  <BraunButton
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    active={totalTime === preset.seconds}
                    color={currentColor}
                    size={44}
                  >
                    {preset.label}
                  </BraunButton>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#999',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {COLOR_OPTIONS.map((option, index) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedColor(index)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: option.color,
                      border: selectedColor === index ? '3px solid #1a1a1a' : '2px solid #E8E8E8',
                      cursor: 'pointer',
                      outline: selectedColor === index && option.color === '#F5F5F5' ? '1px solid #CCC' : 'none',
                    }}
                    title={option.name}
                  />
                ))}
              </div>
            </div>

            {/* Student Counter */}
            <div>
              <label style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#999',
                display: 'block',
                marginBottom: 12,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
                Students
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <BraunButton
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  size={36}
                >
                  −
                </BraunButton>
                <span style={{
                  fontSize: 20,
                  fontWeight: 300,
                  color: '#1a1a1a',
                  minWidth: 36,
                  textAlign: 'center',
                }}>
                  {totalStudents}
                </span>
                <BraunButton
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  size={36}
                >
                  +
                </BraunButton>
                {totalStudents > 1 && (
                  <span style={{
                    fontSize: 11,
                    color: '#999',
                    marginLeft: 8,
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
