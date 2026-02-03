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

// Flip Clock Digit - larger and more premium
const FlipDigit = ({ digit, color }: { digit: string; color: string }) => {
  const textColor = isLightColor(color) ? '#1a1a1a' : '#FFFFFF';
  return (
    <div style={{
      position: 'relative',
      width: 100,
      height: 140,
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: color,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)',
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
          borderBottom: '3px solid rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 110,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: textColor,
            lineHeight: 1,
            transform: 'translateY(50%)',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
            fontSize: 110,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: textColor,
            lineHeight: 1,
            transform: 'translateY(-50%)',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
          background: 'rgba(0,0,0,0.15)',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </div>
  );
};

// Theme colors
const THEMES = {
  dark: {
    bg: '#1a1a1a',
    clockBg: '#2a2a2a',
    displayBg: '#1a1a1a',
    knobBg: '#2a2a2a',
    knobInactive: '#3a3a3a',
    text: '#FFFFFF',
    textMuted: '#666',
    border: '#3a3a3a',
    dot: '#1a1a1a',
  },
  light: {
    bg: '#F5F5F0',
    clockBg: '#FFFFFF',
    displayBg: '#F0F0EB',
    knobBg: '#E8E8E3',
    knobInactive: '#E0E0DB',
    text: '#1a1a1a',
    textMuted: '#888',
    border: '#E0E0DB',
    dot: '#D8D8D3',
  },
};

type ThemeKey = keyof typeof THEMES;

// Knob Component
const Knob = ({
  onClick,
  icon,
  color,
  size = 72,
  label,
  active = false,
  theme,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
  size?: number;
  label: string;
  active?: boolean;
  theme: ThemeKey;
}) => {
  const themeColors = THEMES[theme];
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button
        onClick={onClick}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: active ? color : themeColors.knobBg,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: isDark
            ? `0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.2)`
            : `0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.05)`,
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95) translateY(2px)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
      >
        {/* Knob indicator notch */}
        <div style={{
          position: 'absolute',
          top: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 3,
          height: 8,
          background: active ? 'rgba(255,255,255,0.8)' : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
          borderRadius: 2,
        }} />
        {icon}
      </button>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: themeColors.textMuted,
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
};

// Small Knob for settings
const SmallKnob = ({
  onClick,
  children,
  active = false,
  color,
  theme,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  color: string;
  theme: ThemeKey;
}) => {
  const themeColors = THEMES[theme];
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: active ? color : themeColors.knobInactive,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#FFFFFF' : themeColors.text,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "Helvetica, Arial, sans-serif",
        boxShadow: isDark
          ? (active ? `0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)` : `0 3px 6px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.1)`)
          : (active ? `0 3px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)` : `0 2px 4px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.5)`),
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
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
  const [theme, setTheme] = useState<ThemeKey>('dark');

  const currentPalette = COLOR_PALETTES[selectedPalette];
  const currentColor = currentPalette.colors[Math.min(selectedColor, currentPalette.colors.length - 1)].color;
  const themeColors = THEMES[theme];
  const isDark = theme === 'dark';

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
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      background: themeColors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "Helvetica, Arial, sans-serif",
      padding: 20,
      transition: 'background 0.3s',
    }}>
      {/* Clock Device */}
      <div style={{
        background: themeColors.clockBg,
        borderRadius: 32,
        padding: '40px 48px 48px',
        position: 'relative',
        boxShadow: isDark
          ? `0 20px 40px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 20px 40px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)`,
        transition: 'background 0.3s, box-shadow 0.3s',
      }}>
        {/* Speaker grille pattern at top */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 24,
        }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: themeColors.dot,
            }} />
          ))}
        </div>

        {/* Brand label */}
        <div style={{
          textAlign: 'center',
          marginBottom: 20,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: themeColors.textMuted,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}>
            Timer
          </span>
        </div>

        {/* Student counter */}
        {totalStudents > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20,
          }}>
            <button
              onClick={prevStudent}
              disabled={currentStudent === 1}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: currentStudent === 1 ? themeColors.knobInactive : currentColor,
                border: 'none',
                cursor: currentStudent === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentStudent === 1 ? 0.5 : 1,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: themeColors.textMuted,
              fontFamily: 'monospace',
            }}>
              {currentStudent} / {totalStudents}
            </span>
            <button
              onClick={nextStudent}
              disabled={currentStudent === totalStudents}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: currentStudent === totalStudents ? themeColors.knobInactive : currentColor,
                border: 'none',
                cursor: currentStudent === totalStudents ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentStudent === totalStudents ? 0.5 : 1,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Clock display with recessed look */}
        <div style={{
          background: themeColors.displayBg,
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          boxShadow: isDark ? 'inset 0 4px 8px rgba(0,0,0,0.4)' : 'inset 0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <FlipDigit digit={minTens} color={currentColor} />
            <FlipDigit digit={minOnes} color={currentColor} />

            {/* Colon */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              padding: '0 8px',
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: currentColor,
                boxShadow: `0 0 10px ${currentColor}50`,
              }} />
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: currentColor,
                boxShadow: `0 0 10px ${currentColor}50`,
              }} />
            </div>

            <FlipDigit digit={secTens} color={currentColor} />
            <FlipDigit digit={secOnes} color={currentColor} />
          </div>

          {/* Status indicator */}
          <div style={{
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}>
            {isUrgent && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'rgba(244, 160, 36, 0.2)',
                borderRadius: 14,
                animation: 'pulse 1s infinite',
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F4A024',
                  boxShadow: '0 0 8px #F4A024',
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#F4A024', letterSpacing: 1 }}>
                  FINISHING
                </span>
              </div>
            )}

            {isComplete && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: `${currentColor}20`,
                borderRadius: 14,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={currentColor} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 600, color: currentColor, letterSpacing: 1 }}>
                  COMPLETE
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Control Knobs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
        }}>
          {!isRunning ? (
            <Knob
              onClick={startTimer}
              color={currentColor}
              active={false}
              label="Start"
              theme={theme}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isDark ? '#FFFFFF' : '#666'}>
                  <polygon points="7 4 19 12 7 20 7 4"/>
                </svg>
              }
            />
          ) : (
            <Knob
              onClick={pauseTimer}
              color={currentColor}
              active={true}
              label="Pause"
              theme={theme}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              }
            />
          )}

          <Knob
            onClick={resetTimer}
            color={isDark ? '#666' : '#AAA'}
            active={false}
            label="Reset"
            theme={theme}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#FFFFFF' : '#666'} strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            }
          />

          <Knob
            onClick={() => setShowSettings(!showSettings)}
            color={currentColor}
            active={showSettings}
            label="Settings"
            size={56}
            theme={theme}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showSettings ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#666')} strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            }
          />
        </div>

        {/* Bottom rubber feet indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 200,
          marginTop: 32,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: themeColors.dot,
          }} />
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: themeColors.dot,
          }} />
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: themeColors.clockBg,
          borderTop: `1px solid ${themeColors.border}`,
          padding: '20px 24px 28px',
          transition: 'background 0.3s',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Theme Toggle */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: themeColors.textMuted,
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Background
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setTheme('dark')}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    border: theme === 'dark' ? '3px solid ' + currentColor : '2px solid #3a3a3a',
                    cursor: 'pointer',
                    boxShadow: theme === 'dark' ? `0 0 0 3px ${currentColor}40` : 'none',
                    transition: 'all 0.15s',
                  }}
                  title="Dark"
                />
                <button
                  onClick={() => setTheme('light')}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: theme === 'light' ? '3px solid ' + currentColor : '2px solid #DDD',
                    cursor: 'pointer',
                    boxShadow: theme === 'light' ? `0 0 0 3px ${currentColor}40` : 'none',
                    transition: 'all 0.15s',
                  }}
                  title="Light"
                />
              </div>
            </div>

            {/* Time Presets */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: themeColors.textMuted,
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Minutes
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {presets.map(preset => (
                  <SmallKnob
                    key={preset.seconds}
                    onClick={() => setPresetTime(preset.seconds)}
                    active={totalTime === preset.seconds}
                    color={currentColor}
                    theme={theme}
                  >
                    {preset.label}
                  </SmallKnob>
                ))}
              </div>
            </div>

            {/* Palette Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: themeColors.textMuted,
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Palette
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(Object.keys(COLOR_PALETTES) as PaletteKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handlePaletteChange(key)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 20,
                      background: selectedPalette === key ? currentColor : themeColors.knobInactive,
                      border: 'none',
                      color: selectedPalette === key ? '#FFFFFF' : themeColors.text,
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
                color: themeColors.textMuted,
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Color
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {currentPalette.colors.map((option, index) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedColor(index)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: option.color,
                      border: selectedColor === index ? `3px solid ${isDark ? '#FFFFFF' : '#333'}` : option.color === '#FFFFFF' || option.color === '#FFFF00' || option.color === '#FFFACD' ? '2px solid #BBB' : '2px solid transparent',
                      cursor: 'pointer',
                      boxShadow: selectedColor === index
                        ? `0 0 0 3px ${option.color}, 0 4px 8px rgba(0,0,0,0.3)`
                        : '0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'all 0.15s',
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
                color: themeColors.textMuted,
                display: 'block',
                marginBottom: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                Students
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SmallKnob
                  onClick={() => setTotalStudents(Math.max(1, totalStudents - 1))}
                  active={false}
                  color={currentColor}
                  theme={theme}
                >
                  −
                </SmallKnob>
                <span style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: themeColors.text,
                  minWidth: 40,
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}>
                  {totalStudents}
                </span>
                <SmallKnob
                  onClick={() => setTotalStudents(totalStudents + 1)}
                  active={false}
                  color={currentColor}
                  theme={theme}
                >
                  +
                </SmallKnob>
                {totalStudents > 1 && (
                  <span style={{
                    fontSize: 12,
                    color: themeColors.textMuted,
                    marginLeft: 12,
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
