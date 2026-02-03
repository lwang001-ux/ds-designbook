'use client';

import { useState, useEffect, useCallback } from 'react';

// Color palettes for teachers to choose from
const COLOR_PALETTES = {
  RGB: {
    name: 'RGB',
    colors: [
      { name: 'Red', color: '#FF0000' },
      { name: 'Green', color: '#00FF00' },
      { name: 'Blue', color: '#0000FF' },
      { name: 'White', color: '#FFFFFF' },
      { name: 'Black', color: '#000000' },
    ],
  },
  CMYK: {
    name: 'CMYK',
    colors: [
      { name: 'Cyan', color: '#00FFFF' },
      { name: 'Magenta', color: '#FF00FF' },
      { name: 'Yellow', color: '#FFFF00' },
      { name: 'Key (Black)', color: '#000000' },
    ],
  },
  NEON: {
    name: 'NEON',
    colors: [
      { name: 'Electric Pink', color: '#FF10F0' },
      { name: 'Neon Green', color: '#39FF14' },
      { name: 'Electric Blue', color: '#7DF9FF' },
      { name: 'Neon Orange', color: '#FF6600' },
      { name: 'Neon Yellow', color: '#DFFF00' },
      { name: 'Neon Purple', color: '#BC13FE' },
    ],
  },
  ROYGBV: {
    name: 'ROYGBV',
    colors: [
      { name: 'Red', color: '#FF0000' },
      { name: 'Orange', color: '#FF7F00' },
      { name: 'Yellow', color: '#FFFF00' },
      { name: 'Green', color: '#00FF00' },
      { name: 'Blue', color: '#0000FF' },
      { name: 'Violet', color: '#8B00FF' },
    ],
  },
  PASTEL: {
    name: 'Pastel',
    colors: [
      { name: 'Blush', color: '#FFB6C1' },
      { name: 'Peach', color: '#FFDAB9' },
      { name: 'Mint', color: '#98FB98' },
      { name: 'Sky', color: '#87CEEB' },
      { name: 'Lavender', color: '#E6E6FA' },
      { name: 'Lemon', color: '#FFFACD' },
    ],
  },
};

type PaletteKey = keyof typeof COLOR_PALETTES;

// Helper to determine if a color is light (needs dark text)
const isLightColor = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

// Flip Clock Digit
const FlipDigit = ({ digit, color }: { digit: string; color: string }) => {
  const textColor = isLightColor(color) ? '#2D3047' : '#FFFFFF';
  return (
    <div style={{
      position: 'relative',
      width: 85,
      height: 120,
    }}>
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
          borderBottom: '2px solid rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 90,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: textColor,
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
            fontSize: 90,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: textColor,
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
          background: 'rgba(0,0,0,0.2)',
          transform: 'translateY(-50%)',
        }} />

        {/* Side notches */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: -2,
          width: 4,
          height: 10,
          background: '#F5F5F0',
          borderRadius: '0 2px 2px 0',
          transform: 'translateY(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: -2,
          width: 4,
          height: 10,
          background: '#F5F5F0',
          borderRadius: '2px 0 0 2px',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </div>
  );
};

// Timer Page
export default function TimerPage() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(300);
  const [currentStudent, setCurrentStudent] = useState(1);
  const [totalStudents, setTotalStudents] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [alertPlayed, setAlertPlayed] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<PaletteKey>('NEON');
  const [selectedColor, setSelectedColor] = useState(0);

  const currentPalette = COLOR_PALETTES[selectedPalette];
  const currentColor = currentPalette.colors[Math.min(selectedColor, currentPalette.colors.length - 1)].color;

  // Reset color index when palette changes if out of bounds
  const handlePaletteChange = (palette: PaletteKey) => {
    setSelectedPalette(palette);
    if (selectedColor >= COLOR_PALETTES[palette].colors.length) {
      setSelectedColor(0);
    }
  };

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
      background: '#F5F5F0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Helvetica, Arial, sans-serif",
      padding: 20,
    }}>
      {/* Main container */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '32px 40px 40px',
        position: 'relative',
        border: '1px solid #E8E8E8',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 40,
          right: 40,
          height: 4,
          background: currentColor,
          borderRadius: '0 0 2px 2px',
        }} />

        {/* Header row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          {/* Title with dot accent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: currentColor,
            }} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#999',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              Timer
            </span>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: showSettings ? currentColor : '#F5F5F0',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={showSettings ? '#FFFFFF' : '#666'} strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
              <circle cx="8" cy="6" r="2" fill={showSettings ? '#FFFFFF' : '#666'}/>
              <circle cx="16" cy="12" r="2" fill={showSettings ? '#FFFFFF' : '#666'}/>
              <circle cx="10" cy="18" r="2" fill={showSettings ? '#FFFFFF' : '#666'}/>
            </svg>
          </button>
        </div>

        {/* Student counter */}
        {totalStudents > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20,
            padding: '8px 16px',
            background: '#F5F5F0',
            borderRadius: 20,
            width: 'fit-content',
            margin: '0 auto 20px',
          }}>
            <button
              onClick={prevStudent}
              disabled={currentStudent === 1}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: currentStudent === 1 ? '#E0E0E0' : currentColor,
                border: 'none',
                cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#666',
            }}>
              {currentStudent} / {totalStudents}
            </span>
            <button
              onClick={nextStudent}
              disabled={currentStudent === totalStudents}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: currentStudent === totalStudents ? '#E0E0E0' : currentColor,
                border: 'none',
                cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Clock display */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <FlipDigit digit={minTens} color={currentColor} />
            <FlipDigit digit={minOnes} color={currentColor} />

            {/* Colon */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              padding: '0 4px',
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: currentColor,
              }} />
              <div style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: currentColor,
              }} />
            </div>

            <FlipDigit digit={secTens} color={currentColor} />
            <FlipDigit digit={secOnes} color={currentColor} />
          </div>

          {/* Status indicator */}
          <div style={{
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            {isUrgent && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: '#FFF3E0',
                borderRadius: 12,
                animation: 'pulse 1s infinite',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F4A024' }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#F4A024', letterSpacing: 1 }}>
                  FINISHING
                </span>
              </div>
            )}

            {isComplete && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: currentColor + '20',
                borderRadius: 12,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={currentColor} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: currentColor, letterSpacing: 1 }}>
                  COMPLETE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
        }}>
          {!isRunning ? (
            <button
              onClick={startTimer}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: currentColor,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: '#FFFFFF',
                border: `3px solid ${currentColor}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={currentColor}>
                <rect x="5" y="3" width="5" height="18" rx="1"/>
                <rect x="14" y="3" width="5" height="18" rx="1"/>
              </svg>
            </button>
          )}
          <button
            onClick={resetTimer}
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#F5F5F0',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>

        {/* Bottom decorative line */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 40,
          height: 4,
          background: '#E8E8E8',
          borderRadius: 2,
        }} />
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
          padding: '20px 24px 24px',
        }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            {/* Time Presets */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#999',
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Minutes
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {presets.map(preset => (
                  <button
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: totalTime === preset.seconds ? currentColor : '#F5F5F0',
                      border: 'none',
                      color: totalTime === preset.seconds ? '#FFFFFF' : '#666',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "Helvetica, Arial, sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Palette Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#999',
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Palette
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(Object.keys(COLOR_PALETTES) as PaletteKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePaletteChange(key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      background: selectedPalette === key ? currentColor : '#F5F5F0',
                      border: 'none',
                      color: selectedPalette === key ? '#FFFFFF' : '#666',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "Helvetica, Arial, sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      letterSpacing: 0.5,
                    }}
                  >
                    {COLOR_PALETTES[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#999',
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {currentPalette.colors.map((option, index) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedColor(index)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: option.color,
                      border: selectedColor === index ? '3px solid #2D3047' : option.color === '#FFFFFF' || option.color === '#FFFF00' || option.color === '#FFFACD' ? '1px solid #DDD' : 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                      boxShadow: option.color === '#000000' && selectedColor === index ? 'inset 0 0 0 2px #FFF' : 'none',
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
                color: '#999',
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Students
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#F5F5F0',
                    border: 'none',
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#666',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#2D3047',
                  minWidth: 32,
                  textAlign: 'center',
                }}>
                  {totalStudents}
                </span>
                <button
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#F5F5F0',
                    border: 'none',
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#666',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
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
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
